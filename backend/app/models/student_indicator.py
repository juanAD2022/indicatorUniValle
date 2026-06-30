from sqlalchemy import Column, Integer, String, Boolean, Numeric, SmallInteger

from app.database.database import Base


class StudentIndicator(Base):
    __tablename__ = "student_indicators"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)
    estado = Column(String(30), nullable=False)
    vinculacion = Column(String(30), nullable=False)
    bra = Column(Integer, default=0)
    semestres_cursados = Column(String(10), nullable=False)
    pensum_aprobado_pct = Column(Numeric(5, 2), nullable=False)
    promedio_acumulado = Column(Numeric(4, 2), nullable=False)
    colegio_origen = Column(String(20), nullable=False)
    sexo = Column(String(1), nullable=False)
    estrato = Column(SmallInteger, nullable=False)
    tesis_estado = Column(String(30), nullable=False)
    tesis_nota = Column(Numeric(4, 2), nullable=True)
    acompanamiento_bra = Column(Boolean, default=False)
    practica_profesional = Column(Boolean, default=False)
