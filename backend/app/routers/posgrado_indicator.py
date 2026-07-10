from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.posgrado_indicator import PosgradoIndicator
from app.schemas.student_indicator import (
    PosgradoIndicatorResponse,
    PosgradoIndicatorStatsResponse,
    PosgradoGenderStatsResponse,
    PosgradoTrendDataPoint,
    PosgradoFinancingStatsResponse,
    PosgradoComputedStatsResponse,
)

router = APIRouter(prefix="/api/v1/posgrado-indicators", tags=["posgrado-indicators"])


@router.get("", response_model=list[PosgradoIndicatorResponse])
def list_posgrado_indicators(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if periodo is not None:
        query = query.filter(PosgradoIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)
    return query.order_by(PosgradoIndicator.periodo.desc()).all()


@router.get("/stats", response_model=PosgradoIndicatorStatsResponse)
def get_posgrado_indicator_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if periodo is not None:
        query = query.filter(PosgradoIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)

    record = query.first()
    if not record:
        return PosgradoIndicatorStatsResponse(
            matriculados=0, graduados=0, desertores=0, promedio_acumulado=0.0,
            empleados=0, desempleados=0, ponencias=0, publicaciones=0,
            proyectos_desarrollo=None, proyectos_finalizados=None,
        )

    return PosgradoIndicatorStatsResponse(
        matriculados=record.matriculados,
        graduados=record.graduados,
        desertores=record.desertores,
        promedio_acumulado=float(record.promedio_acumulado),
        empleados=record.empleados,
        desempleados=record.desempleados,
        ponencias=record.ponencias,
        publicaciones=record.publicaciones,
        proyectos_desarrollo=record.proyectos_desarrollo,
        proyectos_finalizados=record.proyectos_finalizados,
    )


@router.get("/gender-stats", response_model=PosgradoGenderStatsResponse)
def get_posgrado_gender_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if periodo is not None:
        query = query.filter(PosgradoIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)

    record = query.first()
    if not record:
        return PosgradoGenderStatsResponse(hombres=0, mujeres=0)

    return PosgradoGenderStatsResponse(hombres=record.hombres, mujeres=record.mujeres)


@router.get("/trend", response_model=list[PosgradoTrendDataPoint])
def get_posgrado_trend_data(
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)

    records = query.order_by(PosgradoIndicator.periodo.desc()).limit(10).all()
    records = list(reversed(records))

    return [
        PosgradoTrendDataPoint(
            periodo=r.periodo,
            matriculados=r.matriculados,
            graduados=r.graduados,
            desertores=r.desertores,
        )
        for r in records
    ]


@router.get("/computed-stats", response_model=PosgradoComputedStatsResponse)
def get_posgrado_computed_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if periodo is not None:
        query = query.filter(PosgradoIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)

    all_records = query.all()

    matriculados = sum(r.matriculados for r in all_records)
    graduados = sum(r.graduados for r in all_records)
    desertores = sum(r.desertores for r in all_records)

    tasa_deserciones = (desertores / matriculados * 100) if matriculados > 0 else 0.0

    return PosgradoComputedStatsResponse(
        tasa_sobrepermanencia=0.0,
        tasa_deserciones=round(tasa_deserciones, 1),
        tasa_retirados_bra=0.0,
        tasa_graduados_10=0.0,
        tasa_graduados_mas_10=0.0,
    )


@router.get("/financing-stats", response_model=PosgradoFinancingStatsResponse)
def get_posgrado_financing_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo: MAESTRIA o ESPECIALIZACION"),
    db: Session = Depends(get_db),
):
    query = db.query(PosgradoIndicator)
    if periodo is not None:
        query = query.filter(PosgradoIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(PosgradoIndicator.tipo_programa == tipo_programa)

    record = query.first()
    if not record:
        return PosgradoFinancingStatsResponse(propia=0, beca=0, credito=0)

    return PosgradoFinancingStatsResponse(
        propia=record.financiacion_propia,
        beca=record.financiacion_beca,
        credito=record.financiacion_credito,
    )


@router.get("/{indicator_id}", response_model=PosgradoIndicatorResponse)
def get_posgrado_indicator(indicator_id: int, db: Session = Depends(get_db)):
    indicator = db.query(PosgradoIndicator).filter(PosgradoIndicator.id == indicator_id).first()
    if not indicator:
        raise HTTPException(status_code=404, detail="Posgrado indicator not found")
    return indicator
