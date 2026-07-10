from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.grupo_inferir_indicator import GrupoInferirIndicator
from app.schemas.grupo_inferir_indicator import (
    GrupoInferirIndicatorResponse,
    GrupoInferirIndicatorStatsResponse,
    GrupoInferirIndicatorTrendDataPoint,
    GrupoInferirIndicatorFinancingStatsResponse,
    GrupoInferirIndicatorLinesStatsResponse,
    GrupoInferirIndicatorInvestigatorsStatsResponse,
    GrupoInferirIndicatorParticipationStatsResponse,
)

router = APIRouter(prefix="/api/v1/grupo-inferir-indicators", tags=["grupo-inferir-indicators"])


@router.get("", response_model=list[GrupoInferirIndicatorResponse])
def list_grupo_inferir_indicators(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)
    return query.order_by(GrupoInferirIndicator.periodo.desc()).all()


@router.get("/stats", response_model=GrupoInferirIndicatorStatsResponse)
def get_grupo_inferir_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)

    record = query.first()
    if not record:
        return GrupoInferirIndicatorStatsResponse(
            profesores_vinculados=0, jovenes_investigadores=0, monitores=0,
            asistentes_investigacion=0, proyectos_desarrollo=0, proyectos_finalizados=0,
            proyectos_cancelados=0, ponencias_nacionales=0, ponencias_internacionales=0,
            revistas_nacionales=0, revistas_internacionales=0, publicaciones_eventos=0,
            libros=0, proyectos_id=0, informes_investigacion=0,
        )

    return GrupoInferirIndicatorStatsResponse(
        profesores_vinculados=record.profesores_vinculados,
        jovenes_investigadores=record.jovenes_investigadores,
        monitores=record.monitores,
        asistentes_investigacion=record.asistentes_investigacion,
        proyectos_desarrollo=record.proyectos_desarrollo,
        proyectos_finalizados=record.proyectos_finalizados,
        proyectos_cancelados=record.proyectos_cancelados,
        ponencias_nacionales=record.ponencias_nacionales,
        ponencias_internacionales=record.ponencias_internacionales,
        revistas_nacionales=record.revistas_nacionales,
        revistas_internacionales=record.revistas_internacionales,
        publicaciones_eventos=record.publicaciones_eventos,
        libros=record.libros,
        proyectos_id=record.proyectos_id,
        informes_investigacion=record.informes_investigacion,
    )


@router.get("/trend", response_model=list[GrupoInferirIndicatorTrendDataPoint])
def get_grupo_inferir_trend(
    db: Session = Depends(get_db),
):
    records = (
        db.query(GrupoInferirIndicator)
        .order_by(GrupoInferirIndicator.periodo.desc())
        .limit(10)
        .all()
    )
    records = list(reversed(records))

    return [
        GrupoInferirIndicatorTrendDataPoint(
            periodo=r.periodo,
            profesores_vinculados=r.profesores_vinculados,
            jovenes_investigadores=r.jovenes_investigadores,
            proyectos_desarrollo=r.proyectos_desarrollo,
            proyectos_finalizados=r.proyectos_finalizados,
            publicaciones_eventos=r.publicaciones_eventos,
        )
        for r in records
    ]


@router.get("/financing-stats", response_model=GrupoInferirIndicatorFinancingStatsResponse)
def get_grupo_inferir_financing_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)

    record = query.first()
    if not record:
        return GrupoInferirIndicatorFinancingStatsResponse(colciencias=0, univalle=0, otros=0)

    return GrupoInferirIndicatorFinancingStatsResponse(
        colciencias=record.financiacion_colciencias,
        univalle=record.financiacion_univalle,
        otros=record.financiacion_otros,
    )


@router.get("/lines-stats", response_model=GrupoInferirIndicatorLinesStatsResponse)
def get_grupo_inferir_lines_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)

    record = query.first()
    if not record:
        return GrupoInferirIndicatorLinesStatsResponse(
            regresion=0, bioestadistica=0, analisis_datos=0, control_estadistico=0
        )

    return GrupoInferirIndicatorLinesStatsResponse(
        regresion=record.linea_regresion,
        bioestadistica=record.linea_bioestadistica,
        analisis_datos=record.linea_analisis_datos,
        control_estadistico=record.linea_control_estadistico,
    )


@router.get("/investigators-stats", response_model=GrupoInferirIndicatorInvestigatorsStatsResponse)
def get_grupo_inferir_investigators_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)

    record = query.first()
    if not record:
        return GrupoInferirIndicatorInvestigatorsStatsResponse(junior=0, asociado=0, senior=0)

    return GrupoInferirIndicatorInvestigatorsStatsResponse(
        junior=record.investigador_junior,
        asociado=record.investigador_asociado,
        senior=record.investigador_senior,
    )


@router.get("/participation-stats", response_model=GrupoInferirIndicatorParticipationStatsResponse)
def get_grupo_inferir_participation_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    query = db.query(GrupoInferirIndicator)
    if periodo is not None:
        query = query.filter(GrupoInferirIndicator.periodo == periodo)

    record = query.first()
    if not record:
        return GrupoInferirIndicatorParticipationStatsResponse(pregrado=0, especializacion=0, maestria=0)

    return GrupoInferirIndicatorParticipationStatsResponse(
        pregrado=record.participacion_pregrado,
        especializacion=record.participacion_especializacion,
        maestria=record.participacion_maestria,
    )


@router.get("/{indicator_id}", response_model=GrupoInferirIndicatorResponse)
def get_grupo_inferir_indicator(indicator_id: int, db: Session = Depends(get_db)):
    indicator = db.query(GrupoInferirIndicator).filter(GrupoInferirIndicator.id == indicator_id).first()
    if not indicator:
        raise HTTPException(status_code=404, detail="Grupo Inferir indicator not found")
    return indicator
