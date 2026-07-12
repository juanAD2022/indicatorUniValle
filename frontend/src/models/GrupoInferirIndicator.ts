export interface GrupoInferirIndicator {
  id: number;
  periodo: string;
  profesores_vinculados: number;
  jovenes_investigadores: number;
  monitores: number;
  asistentes_investigacion: number;
  proyectos_desarrollo: number;
  proyectos_finalizados: number;
  proyectos_cancelados: number;
  convocatorias_internas: number;
  convocatorias_externas: number;
  convocatorias_profesorales: number;
  financiacion_colciencias: number;
  financiacion_univalle: number;
  financiacion_otros: number;
  linea_regresion: number;
  linea_bioestadistica: number;
  linea_analisis_datos: number;
  linea_control_estadistico: number;
  investigador_junior: number;
  investigador_asociado: number;
  investigador_senior: number;
  ponencias_nacionales: number;
  ponencias_internacionales: number;
  revistas_nacionales: number;
  revistas_internacionales: number;
  publicaciones_eventos: number;
  libros: number;
  proyectos_id: number;
  informes_investigacion: number;
  participacion_pregrado: number;
  participacion_especializacion: number;
  participacion_maestria: number;
}

export interface GrupoInferirIndicatorStats {
  profesores_vinculados: number;
  jovenes_investigadores: number;
  monitores: number;
  asistentes_investigacion: number;
  proyectos_desarrollo: number;
  proyectos_finalizados: number;
  proyectos_cancelados: number;
  ponencias_nacionales: number;
  ponencias_internacionales: number;
  revistas_nacionales: number;
  revistas_internacionales: number;
  publicaciones_eventos: number;
  libros: number;
  proyectos_id: number;
  informes_investigacion: number;
}

export interface GrupoInferirTrendDataPoint {
  periodo: string;
  profesores_vinculados: number;
  jovenes_investigadores: number;
  proyectos_desarrollo: number;
  proyectos_finalizados: number;
  publicaciones_eventos: number;
}

export interface GrupoInferirFinancingStats {
  colciencias: number;
  univalle: number;
  otros: number;
}

export interface GrupoInferirLinesStats {
  regresion: number;
  bioestadistica: number;
  analisis_datos: number;
  control_estadistico: number;
}

export interface GrupoInferirParticipationStats {
  pregrado: number;
  especializacion: number;
  maestria: number;
}
