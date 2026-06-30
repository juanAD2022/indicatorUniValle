from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class StudentIndicatorResponse(BaseModel):
    id: int
    periodo: str
    estado: str
    vinculacion: str
    bra: int
    semestres_cursados: str
    pensum_aprobado_pct: Decimal
    promedio_acumulado: Decimal
    colegio_origen: str
    sexo: str
    estrato: int
    tesis_estado: str
    tesis_nota: Optional[Decimal] = None
    acompanamiento_bra: bool
    practica_profesional: bool

    class Config:
        from_attributes = True


class StudentIndicatorStatsResponse(BaseModel):
    matriculados: int
    graduados: int
    reingresados: int
    por_amnistia: int


class StudentIndicatorFilter(BaseModel):
    periodo: Optional[str] = None
    estado: Optional[str] = None
    vinculacion: Optional[str] = None
    bra: Optional[int] = None
    sexo: Optional[str] = None
    estrato: Optional[int] = None
    colegio_origen: Optional[str] = None
    tesis_estado: Optional[str] = None
    acompanamiento_bra: Optional[bool] = None
    practica_profesional: Optional[bool] = None
