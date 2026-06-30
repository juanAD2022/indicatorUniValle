from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.student_indicator import StudentIndicator
from app.schemas.student_indicator import (
    StudentIndicatorResponse,
    StudentIndicatorStatsResponse,
    GenderStatsResponse,
    TrendDataPoint,
)

router = APIRouter(prefix="/api/v1/student-indicators", tags=["student-indicators"])


@router.get("/stats", response_model=StudentIndicatorStatsResponse)
def get_student_indicator_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator.estado, func.count(StudentIndicator.id))

    if periodo is not None:
        query = query.filter(StudentIndicator.periodo == periodo)

    results = dict(query.group_by(StudentIndicator.estado).all())

    return StudentIndicatorStatsResponse(
        matriculados=results.get("MATRICULADO", 0),
        graduados=results.get("EGRESADO", 0),
        reingresados=results.get("REINGRESADO", 0),
        por_amnistia=results.get("AMNISTIA", 0),
    )


@router.get("/gender-stats", response_model=GenderStatsResponse)
def get_gender_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator.sexo, func.count(StudentIndicator.id))

    if periodo is not None:
        query = query.filter(StudentIndicator.periodo == periodo)

    results = dict(query.group_by(StudentIndicator.sexo).all())

    return GenderStatsResponse(
        hombres=results.get("M", 0),
        mujeres=results.get("F", 0),
    )


@router.get("/trend", response_model=list[TrendDataPoint])
def get_trend_data(db: Session = Depends(get_db)):
    periodos = (
        db.query(StudentIndicator.periodo)
        .distinct()
        .order_by(StudentIndicator.periodo.desc())
        .limit(10)
        .all()
    )
    periodos = [p[0] for p in reversed(periodos)]

    results = []
    for periodo in periodos:
        counts = dict(
            db.query(StudentIndicator.estado, func.count(StudentIndicator.id))
            .filter(StudentIndicator.periodo == periodo)
            .group_by(StudentIndicator.estado)
            .all()
        )
        results.append(TrendDataPoint(
            periodo=periodo,
            matriculados=counts.get("MATRICULADO", 0),
            graduados=counts.get("EGRESADO", 0),
            reingresados=counts.get("REINGRESADO", 0),
            por_amnistia=counts.get("AMNISTIA", 0),
        ))

    return results


@router.get("", response_model=list[StudentIndicatorResponse])
def list_student_indicators(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    estado: Optional[str] = Query(None, description="Filtrar por estado académico"),
    vinculacion: Optional[str] = Query(None, description="Filtrar por tipo de vinculación"),
    bra: Optional[int] = Query(None, description="Filtrar por indicador BRA"),
    sexo: Optional[str] = Query(None, description="Filtrar por sexo (M/F)"),
    estrato: Optional[int] = Query(None, description="Filtrar por estrato socioeconómico"),
    colegio_origen: Optional[str] = Query(None, description="Filtrar por tipo de colegio"),
    tesis_estado: Optional[str] = Query(None, description="Filtrar por estado de tesis"),
    acompanamiento_bra: Optional[bool] = Query(None, description="Filtrar por acompañamiento BRA"),
    practica_profesional: Optional[bool] = Query(None, description="Filtrar por práctica profesional"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator)

    if periodo is not None:
        query = query.filter(StudentIndicator.periodo == periodo)
    if estado is not None:
        query = query.filter(StudentIndicator.estado == estado)
    if vinculacion is not None:
        query = query.filter(StudentIndicator.vinculacion == vinculacion)
    if bra is not None:
        query = query.filter(StudentIndicator.bra == bra)
    if sexo is not None:
        query = query.filter(StudentIndicator.sexo == sexo)
    if estrato is not None:
        query = query.filter(StudentIndicator.estrato == estrato)
    if colegio_origen is not None:
        query = query.filter(StudentIndicator.colegio_origen == colegio_origen)
    if tesis_estado is not None:
        query = query.filter(StudentIndicator.tesis_estado == tesis_estado)
    if acompanamiento_bra is not None:
        query = query.filter(StudentIndicator.acompanamiento_bra == acompanamiento_bra)
    if practica_profesional is not None:
        query = query.filter(StudentIndicator.practica_profesional == practica_profesional)

    return query.all()


@router.get("/{indicator_id}", response_model=StudentIndicatorResponse)
def get_student_indicator(indicator_id: int, db: Session = Depends(get_db)):
    indicator = db.query(StudentIndicator).filter(StudentIndicator.id == indicator_id).first()
    if not indicator:
        raise HTTPException(status_code=404, detail="Student indicator not found")
    return indicator
