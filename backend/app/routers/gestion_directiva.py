from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.gestion_directiva import PlaneacionCurso, ProgramacionCurso, ApoyoEconomico
from app.schemas.gestion_directiva import (
    PlaneacionCursoResponse,
    PlaneacionCursoStatsResponse,
    ProgramacionCursoResponse,
    ProgramacionCursoStatsResponse,
    ApoyoEconomicoResponse,
    ApoyoEconomicoStatsResponse,
)

router = APIRouter(prefix="/api/v1/gestion-directiva", tags=["gestion-directiva"])


# =============================================================================
# PLANEACION CURSOS
# =============================================================================

@router.get("/planeacion", response_model=list[PlaneacionCursoResponse])
def list_planeacion(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2024-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(PlaneacionCurso)
    if periodo is not None:
        query = query.filter(PlaneacionCurso.periodo == periodo)
    return query.order_by(PlaneacionCurso.periodo.desc(), PlaneacionCurso.curso.asc()).all()


@router.get("/planeacion/stats", response_model=PlaneacionCursoStatsResponse)
def get_planeacion_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(PlaneacionCurso)
    if periodo is not None:
        query = query.filter(PlaneacionCurso.periodo == periodo)

    total_cursos = query.count()
    total_cupos = query.with_entities(func.sum(PlaneacionCurso.cupos_solicitados)).scalar() or 0
    total_grupos_est = query.with_entities(func.sum(PlaneacionCurso.grupos_estimados)).scalar() or 0
    total_grupos_apr = query.with_entities(func.sum(PlaneacionCurso.grupos_aprobados)).scalar() or 0
    avg_cupo = query.with_entities(func.avg(PlaneacionCurso.cupo_grupo)).scalar() or 0.0

    return PlaneacionCursoStatsResponse(
        total_cursos=total_cursos,
        total_cupos_solicitados=int(total_cupos),
        total_grupos_estimados=int(total_grupos_est),
        total_grupos_aprobados=int(total_grupos_apr),
        promedio_cupo_grupo=float(avg_cupo),
    )


# =============================================================================
# PROGRAMACION CURSOS
# =============================================================================

@router.get("/programacion", response_model=list[ProgramacionCursoResponse])
def list_programacion(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2024-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(ProgramacionCurso)
    if periodo is not None:
        query = query.filter(ProgramacionCurso.periodo == periodo)
    return query.order_by(ProgramacionCurso.periodo.desc(), ProgramacionCurso.curso.asc(), ProgramacionCurso.grupo.asc()).all()


@router.get("/programacion/stats", response_model=ProgramacionCursoStatsResponse)
def get_programacion_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(ProgramacionCurso)
    if periodo is not None:
        query = query.filter(ProgramacionCurso.periodo == periodo)

    total_grupos = query.count()
    total_mat = query.with_entities(func.sum(ProgramacionCurso.matriculados)).scalar() or 0
    total_can = query.with_entities(func.sum(ProgramacionCurso.cancelaron)).scalar() or 0
    total_apr = query.with_entities(func.sum(ProgramacionCurso.aprobaron)).scalar() or 0
    total_rep = query.with_entities(func.sum(ProgramacionCurso.reprobaron)).scalar() or 0

    total_evaluados = total_apr + total_rep
    tasa_aprob = (total_apr / total_evaluados * 100) if total_evaluados > 0 else 0.0
    tasa_canc = (total_can / total_mat * 100) if total_mat > 0 else 0.0

    return ProgramacionCursoStatsResponse(
        total_grupos=total_grupos,
        total_matriculados=int(total_mat),
        total_cancelaron=int(total_can),
        total_aprobaron=int(total_apr),
        total_reprobaron=int(total_rep),
        tasa_aprobacion=round(tasa_aprob, 2),
        tasa_cancelacion=round(tasa_canc, 2),
    )


# =============================================================================
# APOYO ECONOMICO
# =============================================================================

@router.get("/apoyo-economico", response_model=list[ApoyoEconomicoResponse])
def list_apoyo_economico(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2024-1)"),
    db: Session = Depends(get_db),
):
    query = db.query(ApoyoEconomico)
    if periodo is not None:
        query = query.filter(ApoyoEconomico.periodo == periodo)
    return query.order_by(ApoyoEconomico.periodo.desc(), ApoyoEconomico.tipo_evento.asc()).all()


@router.get("/apoyo-economico/stats", response_model=ApoyoEconomicoStatsResponse)
def get_apoyo_economico_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(ApoyoEconomico)
    if periodo is not None:
        query = query.filter(ApoyoEconomico.periodo == periodo)

    total_eventos = query.count()
    total_part = query.with_entities(func.sum(ApoyoEconomico.participantes)).scalar() or 0
    total_apoyo = query.with_entities(func.sum(ApoyoEconomico.apoyo_economico)).scalar() or 0.0
    avg_apoyo = query.with_entities(func.avg(ApoyoEconomico.apoyo_economico)).scalar() or 0.0

    return ApoyoEconomicoStatsResponse(
        total_eventos=total_eventos,
        total_participantes=int(total_part),
        total_apoyo_economico=float(total_apoyo),
        promedio_apoyo_economico=float(avg_apoyo),
    )


@router.get("/apoyo-economico/by-periodo/{periodo}", response_model=list[ApoyoEconomicoResponse])
def get_apoyo_economico_by_periodo(periodo: str, db: Session = Depends(get_db)):
    records = (
        db.query(ApoyoEconomico)
        .filter(ApoyoEconomico.periodo == periodo)
        .order_by(ApoyoEconomico.tipo_evento.asc())
        .all()
    )
    return records
