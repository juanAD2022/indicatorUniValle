from pydantic import BaseModel


class BaseLaboratorioResponse(BaseModel):
    id: int
    periodo: str

    usuarios_estudiantes: int
    usuarios_profesores: int
    usuarios_externos: int

    servicios_solicitados: int
    servicios_atendidos: int

    promedio_horas_uso: float
    satisfaccion: float

    equipos_disponibles: int
    equipos_fuera_servicio: int

    incidentes: int

    class Config:
        from_attributes = True


class BaseLaboratorioStatsResponse(BaseModel):
    usuarios_totales: int
    servicios_solicitados: int
    servicios_atendidos: int
    equipos_disponibles: int
    incidentes: int
    tasa_atencion: float
    disponibilidad_equipos: float
    incidentes_por_100: float
    satisfaccion_promedio: float
    promedio_horas_uso: float


class BaseLaboratorioTrendDataPoint(BaseModel):
    periodo: str
    servicios_solicitados: int
    servicios_atendidos: int


class BaseLaboratorioUserDistribution(BaseModel):
    estudiantes: int
    profesores: int
    externos: int
