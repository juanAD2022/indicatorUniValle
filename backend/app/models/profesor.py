from sqlalchemy import Column, Integer, String, Numeric, UniqueConstraint, DateTime, func

from app.database.database import Base


class Profesor(Base):
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True, unique=True)

    # Cantidades
    planta = Column(Integer, nullable=False, default=0)
    contratistas = Column(Integer, nullable=False, default=0)
    asistentes = Column(Integer, nullable=False, default=0)
    comision = Column(Integer, nullable=False, default=0)

    # Variaciones porcentuales (almacenadas como decimal, ej. 18.18 = 18.18%)
    variacion_planta = Column(Numeric(6, 2), nullable=False, default=0)
    variacion_contratistas = Column(Numeric(6, 2), nullable=False, default=0)
    variacion_asistentes = Column(Numeric(6, 2), nullable=False, default=0)
    variacion_comision = Column(Numeric(6, 2), nullable=False, default=0)

    # Horas
    horas_administrativo = Column(Integer, nullable=False, default=0)
    horas_docencia = Column(Integer, nullable=False, default=0)
    horas_extension = Column(Integer, nullable=False, default=0)
    horas_investigacion = Column(Integer, nullable=False, default=0)

    __table_args__ = (UniqueConstraint("periodo", name="uq_profesores_periodo"),)


class ProfesorActivo(Base):
    __tablename__ = "profesores_activos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    categoria = Column(String(100), nullable=False)
    cvlac = Column(String(500), nullable=True)
    estado = Column(String(50), nullable=False, default="ACTIVO")
    created_at = Column(DateTime, default=func.now())

    __table_args__ = (
        UniqueConstraint("nombre", "categoria", name="uq_profesores_activos_nombre_categoria"),
    )
