from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.extension_social import ExtensionSocial
from app.schemas.extension_social import (
    ExtensionSocialResponse,
    ExtensionSocialStatsResponse,
)

router = APIRouter(prefix="/api/v1/extension-social", tags=["extension-social"])


@router.get("/", response_model=list[ExtensionSocialResponse])
def list_extension_social(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2024-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(ExtensionSocial)
    if periodo is not None:
        query = query.filter(ExtensionSocial.periodo == periodo)
    return query.order_by(ExtensionSocial.periodo.desc()).all()


@router.get("/stats", response_model=ExtensionSocialStatsResponse)
def get_extension_social_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(ExtensionSocial)
    if periodo is not None:
        query = query.filter(ExtensionSocial.periodo == periodo)

    total_registros = query.count()

    total_conferencias = query.with_entities(func.sum(ExtensionSocial.conferencias_dictadas)).scalar() or 0
    total_cursos = query.with_entities(func.sum(ExtensionSocial.cursos_ofrecidos)).scalar() or 0
    total_diplomados = query.with_entities(func.sum(ExtensionSocial.diplomados_ofrecidos)).scalar() or 0
    total_talleres = query.with_entities(func.sum(ExtensionSocial.talleres_ofrecidos)).scalar() or 0
    total_consultorias = query.with_entities(func.sum(ExtensionSocial.consultorias)).scalar() or 0
    total_asistentes = query.with_entities(func.sum(ExtensionSocial.asistentes)).scalar() or 0
    total_horas = query.with_entities(func.sum(ExtensionSocial.horas_ofrecidas)).scalar() or 0
    total_part_est = query.with_entities(func.sum(ExtensionSocial.participacion_estudiantil)).scalar() or 0
    total_part_egr = query.with_entities(func.sum(ExtensionSocial.participacion_egresados)).scalar() or 0
    total_part_prof = query.with_entities(func.sum(ExtensionSocial.participacion_profesores)).scalar() or 0
    total_ingreso = query.with_entities(func.sum(ExtensionSocial.ingreso_neto)).scalar() or 0.0
    avg_ingreso = query.with_entities(func.avg(ExtensionSocial.ingreso_neto)).scalar() or 0.0

    return ExtensionSocialStatsResponse(
        total_registros=total_registros,
        total_conferencias=int(total_conferencias),
        total_cursos=int(total_cursos),
        total_diplomados=int(total_diplomados),
        total_talleres=int(total_talleres),
        total_consultorias=int(total_consultorias),
        total_asistentes=int(total_asistentes),
        total_horas=int(total_horas),
        total_participacion_estudiantil=int(total_part_est),
        total_participacion_egresados=int(total_part_egr),
        total_participacion_profesores=int(total_part_prof),
        total_ingreso_neto=float(total_ingreso),
        promedio_ingreso_neto=float(avg_ingreso),
    )


@router.get("/by-periodo/{periodo}", response_model=ExtensionSocialResponse)
def get_extension_social_by_periodo(periodo: str, db: Session = Depends(get_db)):
    record = (
        db.query(ExtensionSocial)
        .filter(ExtensionSocial.periodo == periodo)
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return record
