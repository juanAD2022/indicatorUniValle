from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProfesorActivoBase(BaseModel):
    nombre: str
    categoria: str
    cvlac: Optional[str] = None
    estado: str = "ACTIVO"


class ProfesorActivoCreate(ProfesorActivoBase):
    pass


class ProfesorActivoUpdate(BaseModel):
    nombre: Optional[str] = None
    categoria: Optional[str] = None
    cvlac: Optional[str] = None
    estado: Optional[str] = None


class ProfesorActivoResponse(ProfesorActivoBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProfesorResponse(BaseModel):
    id: int
    periodo: str
    planta: int
    contratistas: int
    asistentes: int
    comision: int
    variacion_planta: float
    variacion_contratistas: float
    variacion_asistentes: float
    variacion_comision: float
    horas_administrativo: int
    horas_docencia: int
    horas_extension: int
    horas_investigacion: int

    class Config:
        from_attributes = True


class ProfesorStatsResponse(BaseModel):
    total_registros: int
    total_planta: int
    total_contratistas: int
    total_asistentes: int
    total_comision: int
    total_horas_administrativo: int
    total_horas_docencia: int
    total_horas_extension: int
    total_horas_investigacion: int
    promedio_variacion_planta: float
    promedio_variacion_contratistas: float
    promedio_variacion_asistentes: float
    promedio_variacion_comision: float
