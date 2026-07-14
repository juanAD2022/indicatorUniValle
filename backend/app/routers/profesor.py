from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.profesor import Profesor, ProfesorActivo
from app.schemas.profesor import (
    ProfesorResponse,
    ProfesorStatsResponse,
    ProfesorActivoResponse,
    ProfesorActivoCreate,
    ProfesorActivoUpdate,
)

router = APIRouter(prefix="/api/v1/profesores", tags=["profesores"])


@router.get("/", response_model=list[ProfesorResponse])
def list_profesores(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2024-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(Profesor)
    if periodo is not None:
        query = query.filter(Profesor.periodo == periodo)
    return query.order_by(Profesor.periodo.desc()).all()


@router.get("/stats", response_model=ProfesorStatsResponse)
def get_profesor_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(Profesor)
    if periodo is not None:
        query = query.filter(Profesor.periodo == periodo)

    total_registros = query.count()

    total_planta = query.with_entities(func.sum(Profesor.planta)).scalar() or 0
    total_contratistas = query.with_entities(func.sum(Profesor.contratistas)).scalar() or 0
    total_asistentes = query.with_entities(func.sum(Profesor.asistentes)).scalar() or 0
    total_comision = query.with_entities(func.sum(Profesor.comision)).scalar() or 0

    total_horas_admin = query.with_entities(func.sum(Profesor.horas_administrativo)).scalar() or 0
    total_horas_docencia = query.with_entities(func.sum(Profesor.horas_docencia)).scalar() or 0
    total_horas_extension = query.with_entities(func.sum(Profesor.horas_extension)).scalar() or 0
    total_horas_inv = query.with_entities(func.sum(Profesor.horas_investigacion)).scalar() or 0

    avg_var_planta = query.with_entities(func.avg(Profesor.variacion_planta)).scalar() or 0.0
    avg_var_contratistas = query.with_entities(func.avg(Profesor.variacion_contratistas)).scalar() or 0.0
    avg_var_asistentes = query.with_entities(func.avg(Profesor.variacion_asistentes)).scalar() or 0.0
    avg_var_comision = query.with_entities(func.avg(Profesor.variacion_comision)).scalar() or 0.0

    return ProfesorStatsResponse(
        total_registros=total_registros,
        total_planta=int(total_planta),
        total_contratistas=int(total_contratistas),
        total_asistentes=int(total_asistentes),
        total_comision=int(total_comision),
        total_horas_administrativo=int(total_horas_admin),
        total_horas_docencia=int(total_horas_docencia),
        total_horas_extension=int(total_horas_extension),
        total_horas_investigacion=int(total_horas_inv),
        promedio_variacion_planta=float(avg_var_planta),
        promedio_variacion_contratistas=float(avg_var_contratistas),
        promedio_variacion_asistentes=float(avg_var_asistentes),
        promedio_variacion_comision=float(avg_var_comision),
    )


@router.get("/by-periodo/{periodo}", response_model=ProfesorResponse)
def get_profesor_by_periodo(periodo: str, db: Session = Depends(get_db)):
    record = (
        db.query(Profesor)
        .filter(Profesor.periodo == periodo)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return record


# =============================================================================
# PROFESORES ACTIVOS (INDIVIDUALES)
# =============================================================================

@router.get("/activos", response_model=List[ProfesorActivoResponse])
def list_profesores_activos(
    categoria: Optional[str] = Query(None, description="Filtrar por categoría"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    search: Optional[str] = Query(None, description="Buscar por nombre"),
    db: Session = Depends(get_db),
):
    query = db.query(ProfesorActivo)
    if categoria:
        query = query.filter(ProfesorActivo.categoria == categoria)
    if estado:
        query = query.filter(ProfesorActivo.estado == estado)
    if search:
        query = query.filter(ProfesorActivo.nombre.ilike(f"%{search}%"))
    return query.order_by(ProfesorActivo.nombre.asc()).all()


@router.get("/activos/{profesor_id}", response_model=ProfesorActivoResponse)
def get_profesor_activo(profesor_id: int, db: Session = Depends(get_db)):
    record = db.query(ProfesorActivo).filter(ProfesorActivo.id == profesor_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    return record


@router.post("/activos", response_model=ProfesorActivoResponse)
def create_profesor_activo(
    data: ProfesorActivoCreate,
    db: Session = Depends(get_db),
):
    # Verificar duplicado
    existing = db.query(ProfesorActivo).filter(
        ProfesorActivo.nombre == data.nombre,
        ProfesorActivo.categoria == data.categoria,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ya existe un profesor con ese nombre y categoría")

    record = ProfesorActivo(**data.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.put("/activos/{profesor_id}", response_model=ProfesorActivoResponse)
def update_profesor_activo(
    profesor_id: int,
    data: ProfesorActivoUpdate,
    db: Session = Depends(get_db),
):
    record = db.query(ProfesorActivo).filter(ProfesorActivo.id == profesor_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/activos/{profesor_id}")
def delete_profesor_activo(profesor_id: int, db: Session = Depends(get_db)):
    record = db.query(ProfesorActivo).filter(ProfesorActivo.id == profesor_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")

    db.delete(record)
    db.commit()
    return {"message": "Profesor eliminado correctamente"}
