from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.student_indicator import StudentIndicator
from app.models.proceedings import Proceeding
from app.schemas.student_indicator import DashboardStatsResponse

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    periodo: Optional[str] = Query(None, description="Filtrar por periodo"),
    db: Session = Depends(get_db),
):
    base_filter = []
    if periodo is not None:
        base_filter.append(StudentIndicator.periodo == periodo)

    # Estudiantes activos por tipo de programa
    tipo_results = dict(
        db.query(StudentIndicator.tipo_programa, func.count(StudentIndicator.id))
        .filter(StudentIndicator.estado == "MATRICULADO", *base_filter)
        .group_by(StudentIndicator.tipo_programa)
        .all()
    )

    estudiantes_pregrado = tipo_results.get("PREGRADO", 0)
    estudiantes_especializacion = tipo_results.get("ESPECIALIZACION", 0)
    estudiantes_maestria = tipo_results.get("MAESTRIA", 0)
    estudiantes_total = estudiantes_pregrado + estudiantes_especializacion + estudiantes_maestria

    # Documentos cargados
    documentos = db.query(func.count(Proceeding.id)).scalar() or 0

    return DashboardStatsResponse(
        estudiantes_activos_total=estudiantes_total,
        estudiantes_por_tipo={
            "pregrado": estudiantes_pregrado,
            "especializacion": estudiantes_especializacion,
            "maestria": estudiantes_maestria,
        },
        profesores=0,
        usuarios_laboratorio=0,
        documentos=documentos,
        publicaciones=0,
        cursos_extension=0,
    )
