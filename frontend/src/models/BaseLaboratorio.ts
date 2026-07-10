export interface BaseLaboratorio {
  id: number;
  periodo: string;
  usuarios_estudiantes: number;
  usuarios_profesores: number;
  usuarios_externos: number;
  servicios_solicitados: number;
  servicios_atendidos: number;
  promedio_horas_uso: number;
  satisfaccion: number;
  equipos_disponibles: number;
  equipos_fuera_servicio: number;
  incidentes: number;
}

export interface BaseLaboratorioStats {
  usuarios_totales: number;
  servicios_solicitados: number;
  servicios_atendidos: number;
  equipos_disponibles: number;
  incidentes: number;
  tasa_atencion: number;
  disponibilidad_equipos: number;
  incidentes_por_100: number;
  satisfaccion_promedio: number;
  promedio_horas_uso: number;
}

export interface BaseLaboratorioTrendDataPoint {
  periodo: string;
  servicios_solicitados: number;
  servicios_atendidos: number;
}

export interface BaseLaboratorioUserDistribution {
  estudiantes: number;
  profesores: number;
  externos: number;
}
