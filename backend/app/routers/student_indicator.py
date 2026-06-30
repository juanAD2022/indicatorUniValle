from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.student_indicator import StudentIndicator
from app.schemas.student_indicator import StudentIndicatorResponse

router = APIRouter(prefix="/api/v1/student-indicators", tags=["student-indicators"])


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
