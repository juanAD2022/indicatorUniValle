from pydantic import BaseModel
from typing import Optional


class GrupoInferirIndicatorResponse(BaseModel):
    id: int
    periodo: str

    profesores_vinculados: int
    jovenes_investigadores: int
    monitores: int
    asistentes_investigacion: int

    proyectos_desarrollo: int
    proyectos_finalizados: int
    proyectos_cancelados: int

    convocatorias_internas: int
    convocatorias_externas: int
    convocatorias_profesorales: int

    financiacion_colciencias: int
    financiacion_univalle: int
    financiacion_otros: int

    linea_regresion: int
    linea_bioestadistica: int
    linea_analisis_datos: int
    linea_control_estadistico: int

    investigador_junior: int
    investigador_asociado: int
    investigador_senior: int

    ponencias_nacionales: int
    ponencias_internacionales: int

    revistas_nacionales: int
    revistas_internacionales: int
    publicaciones_eventos: int
    libros: int

    proyectos_id: int
    informes_investigacion: int

    participacion_pregrado: int
    participacion_especializacion: int
    participacion_maestria: int

    class Config:
        from_attributes = True


class GrupoInferirIndicatorStatsResponse(BaseModel):
    profesores_vinculados: int
    jovenes_investigadores: int
    monitores: int
    asistentes_investigacion: int
    proyectos_desarrollo: int
    proyectos_finalizados: int
    proyectos_cancelados: int
    ponencias_nacionales: int
    ponencias_internacionales: int
    revistas_nacionales: int
    revistas_internacionales: int
    publicaciones_eventos: int
    libros: int
    proyectos_id: int
    informes_investigacion: int


class GrupoInferirIndicatorTrendDataPoint(BaseModel):
    periodo: str
    profesores_vinculados: int
    jovenes_investigadores: int
    proyectos_desarrollo: int
    proyectos_finalizados: int
    publicaciones_eventos: int


class GrupoInferirIndicatorFinancingStatsResponse(BaseModel):
    colciencias: int
    univalle: int
    otros: int


class GrupoInferirIndicatorLinesStatsResponse(BaseModel):
    regresion: int
    bioestadistica: int
    analisis_datos: int
    control_estadistico: int


class GrupoInferirIndicatorInvestigatorsStatsResponse(BaseModel):
    junior: int
    asociado: int
    senior: int


class GrupoInferirIndicatorParticipationStatsResponse(BaseModel):
    pregrado: int
    especializacion: int
    maestria: int
