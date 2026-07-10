from sqlalchemy import Column, Integer, String, UniqueConstraint

from app.database.database import Base


class GrupoInferirIndicator(Base):
    __tablename__ = "grupo_inferir_indicators"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    periodo = Column(String(10), nullable=False, index=True)

    profesores_vinculados = Column(Integer, nullable=False, default=0)
    jovenes_investigadores = Column(Integer, nullable=False, default=0)
    monitores = Column(Integer, nullable=False, default=0)
    asistentes_investigacion = Column(Integer, nullable=False, default=0)

    proyectos_desarrollo = Column(Integer, nullable=False, default=0)
    proyectos_finalizados = Column(Integer, nullable=False, default=0)
    proyectos_cancelados = Column(Integer, nullable=False, default=0)

    convocatorias_internas = Column(Integer, nullable=False, default=0)
    convocatorias_externas = Column(Integer, nullable=False, default=0)
    convocatorias_profesorales = Column(Integer, nullable=False, default=0)

    financiacion_colciencias = Column(Integer, nullable=False, default=0)
    financiacion_univalle = Column(Integer, nullable=False, default=0)
    financiacion_otros = Column(Integer, nullable=False, default=0)

    linea_regresion = Column(Integer, nullable=False, default=0)
    linea_bioestadistica = Column(Integer, nullable=False, default=0)
    linea_analisis_datos = Column(Integer, nullable=False, default=0)
    linea_control_estadistico = Column(Integer, nullable=False, default=0)

    investigador_junior = Column(Integer, nullable=False, default=0)
    investigador_asociado = Column(Integer, nullable=False, default=0)
    investigador_senior = Column(Integer, nullable=False, default=0)

    ponencias_nacionales = Column(Integer, nullable=False, default=0)
    ponencias_internacionales = Column(Integer, nullable=False, default=0)

    revistas_nacionales = Column(Integer, nullable=False, default=0)
    revistas_internacionales = Column(Integer, nullable=False, default=0)
    publicaciones_eventos = Column(Integer, nullable=False, default=0)
    libros = Column(Integer, nullable=False, default=0)

    proyectos_id = Column(Integer, nullable=False, default=0)
    informes_investigacion = Column(Integer, nullable=False, default=0)

    participacion_pregrado = Column(Integer, nullable=False, default=0)
    participacion_especializacion = Column(Integer, nullable=False, default=0)
    participacion_maestria = Column(Integer, nullable=False, default=0)

    __table_args__ = (
        UniqueConstraint("periodo", name="uq_grupo_inferir_periodo"),
    )
