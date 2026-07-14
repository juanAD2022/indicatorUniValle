from sqlalchemy import Column, Integer, String, Numeric, UniqueConstraint

from app.database.database import Base


class ExtensionSocial(Base):
    __tablename__ = "extension_social"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True, unique=True)

    conferencias_dictadas = Column(Integer, nullable=False, default=0)
    cursos_ofrecidos = Column(Integer, nullable=False, default=0)
    diplomados_ofrecidos = Column(Integer, nullable=False, default=0)
    talleres_ofrecidos = Column(Integer, nullable=False, default=0)
    consultorias = Column(Integer, nullable=False, default=0)
    asistentes = Column(Integer, nullable=False, default=0)
    horas_ofrecidas = Column(Integer, nullable=False, default=0)
    participacion_estudiantil = Column(Integer, nullable=False, default=0)
    participacion_egresados = Column(Integer, nullable=False, default=0)
    participacion_profesores = Column(Integer, nullable=False, default=0)
    ingreso_neto = Column(Numeric(15, 2), nullable=False, default=0)
