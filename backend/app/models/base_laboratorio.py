from sqlalchemy import Column, Integer, String, Float, UniqueConstraint

from app.database.database import Base


class BaseLaboratorio(Base):
    __tablename__ = "base_laboratorios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)

    usuarios_estudiantes = Column(Integer, nullable=False, default=0)
    usuarios_profesores = Column(Integer, nullable=False, default=0)
    usuarios_externos = Column(Integer, nullable=False, default=0)

    servicios_solicitados = Column(Integer, nullable=False, default=0)
    servicios_atendidos = Column(Integer, nullable=False, default=0)

    promedio_horas_uso = Column(Float, nullable=False, default=0.0)
    satisfaccion = Column(Float, nullable=False, default=0.0)

    equipos_disponibles = Column(Integer, nullable=False, default=0)
    equipos_fuera_servicio = Column(Integer, nullable=False, default=0)

    incidentes = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("periodo", name="uq_base_laboratorio_periodo"),
    )
