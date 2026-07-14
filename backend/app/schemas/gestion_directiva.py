from pydantic import BaseModel


class PlaneacionCursoResponse(BaseModel):
    id: int
    periodo: str
    curso: str
    cupos_solicitados: int
    grupos_estimados: int
    cupo_grupo: int
    grupos_aprobados: int

    class Config:
        from_attributes = True


class PlaneacionCursoStatsResponse(BaseModel):
    total_cursos: int
    total_cupos_solicitados: int
    total_grupos_estimados: int
    total_grupos_aprobados: int
    promedio_cupo_grupo: float


class ProgramacionCursoResponse(BaseModel):
    id: int
    periodo: str
    curso: str
    grupo: str
    profesor: str | None
    vinculacion: str | None
    horario: str | None
    edificio: str | None
    salon: str | None
    matriculados: int
    cancelaron: int
    aprobaron: int
    reprobaron: int

    class Config:
        from_attributes = True


class ProgramacionCursoStatsResponse(BaseModel):
    total_grupos: int
    total_matriculados: int
    total_cancelaron: int
    total_aprobaron: int
    total_reprobaron: int
    tasa_aprobacion: float
    tasa_cancelacion: float


class ApoyoEconomicoResponse(BaseModel):
    id: int
    periodo: str
    nivel: str | None
    tipo_evento: str | None
    lugar: str | None
    pais: str | None
    participantes: int
    rol: str | None
    apoyo_economico: float

    class Config:
        from_attributes = True


class ApoyoEconomicoStatsResponse(BaseModel):
    total_eventos: int
    total_participantes: int
    total_apoyo_economico: float
    promedio_apoyo_economico: float
