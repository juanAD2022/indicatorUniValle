from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AlertResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    tipo: str
    estado: str
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    tipo: str
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None


class AlertUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    tipo: Optional[str] = None
    estado: Optional[str] = None
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
