from sqlalchemy import Column, Integer, String, Numeric, UniqueConstraint

from app.database.database import Base


class PlaneacionCurso(Base):
    __tablename__ = "planeacion_cursos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)
    curso = Column(String(200), nullable=False)

    cupos_solicitados = Column(Integer, nullable=False, default=0)
    grupos_estimados = Column(Integer, nullable=False, default=0)
    cupo_grupo = Column(Integer, nullable=False, default=0)
    grupos_aprobados = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("periodo", "curso", name="uq_planeacion_periodo_curso"),
    )


class ProgramacionCurso(Base):
    __tablename__ = "programacion_cursos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)
    curso = Column(String(200), nullable=False)
    grupo = Column(String(10), nullable=False)

    profesor = Column(String(200), nullable=True)
    vinculacion = Column(String(100), nullable=True)
    horario = Column(String(200), nullable=True)
    edificio = Column(String(100), nullable=True)
    salon = Column(String(50), nullable=True)

    matriculados = Column(Integer, nullable=False, default=0)
    cancelaron = Column(Integer, nullable=False, default=0)
    aprobaron = Column(Integer, nullable=False, default=0)
    reprobaron = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("periodo", "curso", "grupo", name="uq_programacion_periodo_curso_grupo"),
    )


class ApoyoEconomico(Base):
    __tablename__ = "apoyos_economicos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)

    nivel = Column(String(100), nullable=True)
    tipo_evento = Column(String(200), nullable=True)
    lugar = Column(String(200), nullable=True)
    pais = Column(String(100), nullable=True)
    participantes = Column(Integer, nullable=False, default=0)
    rol = Column(String(100), nullable=True)
    apoyo_economico = Column(Numeric(15, 2), nullable=False, default=0)
