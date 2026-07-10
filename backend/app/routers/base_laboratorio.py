from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.base_laboratorio import BaseLaboratorio
from app.schemas.base_laboratorio import (
    BaseLaboratorioResponse,
    BaseLaboratorioStatsResponse,
    BaseLaboratorioTrendDataPoint,
    BaseLaboratorioUserDistribution,
)

router = APIRouter(prefix="/api/v1/base-laboratorio", tags=["base-laboratorio"])


@router.get("", response_model=list[BaseLaboratorioResponse])
def list_base_laboratorio(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2012-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(BaseLaboratorio)

    if periodo is not None:
        query = query.filter(BaseLaboratorio.periodo == periodo)

    return query.order_by(BaseLaboratorio.periodo.desc()).all()


@router.get("/stats", response_model=BaseLaboratorioStatsResponse)
def get_base_laboratorio_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(BaseLaboratorio)
    if periodo is not None:
        query = query.filter(BaseLaboratorio.periodo == periodo)

    record = query.first()
    if not record:
        return BaseLaboratorioStatsResponse(
            usuarios_totales=0,
            servicios_solicitados=0,
            servicios_atendidos=0,
            equipos_disponibles=0,
            incidentes=0,
            tasa_atencion=0.0,
            disponibilidad_equipos=0.0,
            incidentes_por_100=0.0,
            satisfaccion_promedio=0.0,
            promedio_horas_uso=0.0,
        )

    usuarios_totales = record.usuarios_estudiantes + record.usuarios_profesores + record.usuarios_externos

    tasa_atencion = (record.servicios_atendidos / record.servicios_solicitados * 100) if record.servicios_solicitados > 0 else 0.0

    total_equipos = record.equipos_disponibles + record.equipos_fuera_servicio
    disponibilidad_equipos = (record.equipos_disponibles / total_equipos * 100) if total_equipos > 0 else 0.0

    incidentes_por_100 = (record.incidentes / record.servicios_atendidos * 100) if record.servicios_atendidos > 0 else 0.0

    return BaseLaboratorioStatsResponse(
        usuarios_totales=usuarios_totales,
        servicios_solicitados=record.servicios_solicitados,
        servicios_atendidos=record.servicios_atendidos,
        equipos_disponibles=record.equipos_disponibles,
        incidentes=record.incidentes,
        tasa_atencion=round(tasa_atencion, 2),
        disponibilidad_equipos=round(disponibilidad_equipos, 2),
        incidentes_por_100=round(incidentes_por_100, 2),
        satisfaccion_promedio=record.satisfaccion,
        promedio_horas_uso=record.promedio_horas_uso,
    )


@router.get("/trend", response_model=list[BaseLaboratorioTrendDataPoint])
def get_base_laboratorio_trend(db: Session = Depends(get_db)):
    records = (
        db.query(BaseLaboratorio)
        .order_by(BaseLaboratorio.periodo.desc())
        .limit(10)
        .all()
    )
    records = list(reversed(records))

    return [
        BaseLaboratorioTrendDataPoint(
            periodo=r.periodo,
            servicios_solicitados=r.servicios_solicitados,
            servicios_atendidos=r.servicios_atendidos,
        )
        for r in records
    ]


@router.get("/user-distribution", response_model=BaseLaboratorioUserDistribution)
def get_base_laboratorio_user_distribution(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(BaseLaboratorio)
    if periodo is not None:
        query = query.filter(BaseLaboratorio.periodo == periodo)

    record = query.first()
    if not record:
        return BaseLaboratorioUserDistribution(estudiantes=0, profesores=0, externos=0)

    return BaseLaboratorioUserDistribution(
        estudiantes=record.usuarios_estudiantes,
        profesores=record.usuarios_profesores,
        externos=record.usuarios_externos,
    )


@router.get("/{periodo}", response_model=BaseLaboratorioResponse)
def get_base_laboratorio_by_periodo(periodo: str, db: Session = Depends(get_db)):
    record = db.query(BaseLaboratorio).filter(BaseLaboratorio.periodo == periodo).first()
    if not record:
        raise HTTPException(status_code=404, detail="Registro no encontrado para este periodo")
    return record
