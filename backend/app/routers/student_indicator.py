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
    ComputedStatsResponse,
    CohortSummaryResponse,
)

router = APIRouter(prefix="/api/v1/student-indicators", tags=["student-indicators"])


@router.get("/stats", response_model=StudentIndicatorStatsResponse)
def get_student_indicator_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
    db: Session = Depends(get_db),
):
    base_filter = []
    if periodo is not None:
        base_filter.append(StudentIndicator.periodo == periodo)
    if tipo_programa is not None:
        base_filter.append(StudentIndicator.tipo_programa == tipo_programa)

    estado_results = dict(
        db.query(StudentIndicator.estado, func.count(StudentIndicator.id))
        .filter(*base_filter)
        .group_by(StudentIndicator.estado)
        .all()
    )

    vinculacion_results = dict(
        db.query(StudentIndicator.vinculacion, func.count(StudentIndicator.id))
        .filter(*base_filter)
        .group_by(StudentIndicator.vinculacion)
        .all()
    )

    return StudentIndicatorStatsResponse(
        matriculados=estado_results.get("MATRICULADO", 0),
        graduados=estado_results.get("GRADUADO", 0),
        reingresados=vinculacion_results.get("REINGRESO", 0),
        por_amnistia=vinculacion_results.get("AMNISTIA", 0),
        retirados=estado_results.get("RETIRADO", 0),
        desertores=estado_results.get("DESERTOR", 0),
    )


@router.get("/gender-stats", response_model=GenderStatsResponse)
def get_gender_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator.sexo, func.count(StudentIndicator.id))

    if periodo is not None:
        query = query.filter(StudentIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(StudentIndicator.tipo_programa == tipo_programa)

    results = dict(query.group_by(StudentIndicator.sexo).all())

    return GenderStatsResponse(
        hombres=results.get("M", 0),
        mujeres=results.get("F", 0),
    )


@router.get("/trend", response_model=list[TrendDataPoint])
def get_trend_data(
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator.periodo).distinct()
    if tipo_programa is not None:
        query = query.filter(StudentIndicator.tipo_programa == tipo_programa)

    periodos = (
        query.order_by(StudentIndicator.periodo.desc())
        .limit(10)
        .all()
    )
    periodos = [p[0] for p in reversed(periodos)]

    results = []
    for periodo in periodos:
        count_query = db.query(StudentIndicator.estado, func.count(StudentIndicator.id)).filter(
            StudentIndicator.periodo == periodo
        )
        if tipo_programa is not None:
            count_query = count_query.filter(StudentIndicator.tipo_programa == tipo_programa)

        counts = dict(count_query.group_by(StudentIndicator.estado).all())
        results.append(TrendDataPoint(
            periodo=periodo,
            matriculados=counts.get("MATRICULADO", 0),
            graduados=counts.get("EGRESADO", 0),
            desertores=counts.get("DESERTOR", 0),
        ))

    return results


@router.get("/cohort-summary", response_model=list[CohortSummaryResponse])
def get_cohort_summary(
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator)
    if tipo_programa is not None:
        query = query.filter(StudentIndicator.tipo_programa == tipo_programa)

    all_students = query.all()

    periodos_map: dict[str, dict] = {}
    for s in all_students:
        p = s.periodo
        if p not in periodos_map:
            periodos_map[p] = {
                "periodo": p,
                "matriculados": 0,
                "graduados": 0,
                "desertores": 0,
                "retirados_bra": 0,
                "tesis_en_desarrollo": 0,
                "tesis_finalizados": 0,
                "practicas_profesionales": 0,
            }
        entry = periodos_map[p]
        if s.estado == "MATRICULADO":
            entry["matriculados"] += 1
        if s.estado == "GRADUADO":
            entry["graduados"] += 1
        if s.estado == "DESERTOR":
            entry["desertores"] += 1
        if s.estado == "RETIRADO" and s.bra == 1:
            entry["retirados_bra"] += 1
        if s.tesis_estado == "EN_PROCESO":
            entry["tesis_en_desarrollo"] += 1
        if s.tesis_estado == "APROBADA":
            entry["tesis_finalizados"] += 1
        if s.practica_profesional:
            entry["practicas_profesionales"] += 1

    result = sorted(periodos_map.values(), key=lambda x: x["periodo"], reverse=True)
    return [CohortSummaryResponse(**item) for item in result]


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
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
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
    if tipo_programa is not None:
        query = query.filter(StudentIndicator.tipo_programa == tipo_programa)

    return query.all()


@router.get("/computed-stats", response_model=ComputedStatsResponse)
def get_computed_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo (ej. 2018-2)"),
    tipo_programa: Optional[str] = Query(None, description="Filtrar por tipo de programa (PREGRADO/POSGRADO/ESPECIALIZACION)"),
    db: Session = Depends(get_db),
):
    query = db.query(StudentIndicator)
    if periodo is not None:
        query = query.filter(StudentIndicator.periodo == periodo)
    if tipo_programa is not None:
        query = query.filter(StudentIndicator.tipo_programa == tipo_programa)

    all_students = query.all()

    matriculados_count = sum(1 for s in all_students if s.estado == "MATRICULADO")
    sobrepermanencia_count = sum(
        1 for s in all_students if s.semestres_cursados and int(s.semestres_cursados) > 10
    )
    tasa_sobrepermanencia = (sobrepermanencia_count / matriculados_count * 100) if matriculados_count > 0 else 0.0

    desertores = sum(1 for s in all_students if s.estado == "DESERTOR")
    tasa_deserciones = (desertores / total_registrados * 100) if total_registrados > 0 else 0.0

    total_registrados = len(all_students)
    retirados = sum(1 for s in all_students if s.estado == "RETIRADO")
    tasa_retirados_bra = (retirados / total_registrados * 100) if total_registrados > 0 else 0.0

    graduados = [s for s in all_students if s.estado == "EGRESADO"]
    total_graduados = len(graduados)
    graduados_10 = sum(1 for s in graduados if s.semestres_cursados and int(s.semestres_cursados) == 10)
    tasa_graduados_10 = (graduados_10 / total_graduados * 100) if total_graduados > 0 else 0.0

    graduados_mas_10 = sum(1 for s in graduados if s.semestres_cursados and int(s.semestres_cursados) > 10)
    tasa_graduados_mas_10 = (graduados_mas_10 / total_graduados * 100) if total_graduados > 0 else 0.0

    return ComputedStatsResponse(
        tasa_sobrepermanencia=round(tasa_sobrepermanencia, 1),
        tasa_deserciones=round(tasa_deserciones, 1),
        tasa_retirados_bra=round(tasa_retirados_bra, 1),
        tasa_graduados_10=round(tasa_graduados_10, 1),
        tasa_graduados_mas_10=round(tasa_graduados_mas_10, 1),
    )


@router.get("/{indicator_id}", response_model=StudentIndicatorResponse)
def get_student_indicator(indicator_id: int, db: Session = Depends(get_db)):
    indicator = db.query(StudentIndicator).filter(StudentIndicator.id == indicator_id).first()
    if not indicator:
        raise HTTPException(status_code=404, detail="Student indicator not found")
    return indicator
