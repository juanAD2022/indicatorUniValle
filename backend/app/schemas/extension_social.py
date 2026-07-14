from pydantic import BaseModel


class ExtensionSocialResponse(BaseModel):
    id: int
    periodo: str
    conferencias_dictadas: int
    cursos_ofrecidos: int
    diplomados_ofrecidos: int
    talleres_ofrecidos: int
    consultorias: int
    asistentes: int
    horas_ofrecidas: int
    participacion_estudiantil: int
    participacion_egresados: int
    participacion_profesores: int
    ingreso_neto: float

    class Config:
        from_attributes = True


class ExtensionSocialStatsResponse(BaseModel):
    total_registros: int
    total_conferencias: int
    total_cursos: int
    total_diplomados: int
    total_talleres: int
    total_consultorias: int
    total_asistentes: int
    total_horas: int
    total_participacion_estudiantil: int
    total_participacion_egresados: int
    total_participacion_profesores: int
    total_ingreso_neto: float
    promedio_ingreso_neto: float
