from sqlalchemy import Column, Integer, String, Numeric, UniqueConstraint

from app.database.database import Base


class PosgradoIndicator(Base):
    __tablename__ = "posgrado_indicators"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)
    tipo_programa = Column(String(20), nullable=False)

    matriculados = Column(Integer, nullable=False, default=0)
    graduados = Column(Integer, nullable=False, default=0)
    desertores = Column(Integer, nullable=False, default=0)
    promedio_acumulado = Column(Numeric(4, 2), nullable=False, default=0)

    hombres = Column(Integer, nullable=False, default=0)
    mujeres = Column(Integer, nullable=False, default=0)

    empleados = Column(Integer, nullable=False, default=0)
    desempleados = Column(Integer, nullable=False, default=0)

    financiacion_propia = Column(Integer, nullable=False, default=0)
    financiacion_beca = Column(Integer, nullable=False, default=0)
    financiacion_credito = Column(Integer, nullable=False, default=0)

    ponencias = Column(Integer, nullable=False, default=0)
    publicaciones = Column(Integer, nullable=False, default=0)

    proyectos_desarrollo = Column(Integer, nullable=True)
    proyectos_finalizados = Column(Integer, nullable=True)

    __table_args__ = (
        UniqueConstraint("periodo", "tipo_programa", name="uq_posgrado_periodo_tipo"),
    )
