export interface PosgradoIndicator {
  id: number;
  periodo: string;
  tipo_programa: string;
  matriculados: number;
  graduados: number;
  desertores: number;
  promedio_acumulado: number;
  hombres: number;
  mujeres: number;
  empleados: number;
  desempleados: number;
  financiacion_propia: number;
  financiacion_beca: number;
  financiacion_credito: number;
  ponencias: number;
  publicaciones: number;
  proyectos_desarrollo: number | null;
  proyectos_finalizados: number | null;
}

export interface PosgradoIndicatorStats {
  matriculados: number;
  graduados: number;
  desertores: number;
  promedio_acumulado: number;
  empleados: number;
  desempleados: number;
  ponencias: number;
  publicaciones: number;
  proyectos_desarrollo: number | null;
  proyectos_finalizados: number | null;
}

export interface PosgradoGenderStats {
  hombres: number;
  mujeres: number;
}

export interface PosgradoTrendDataPoint {
  periodo: string;
  matriculados: number;
  graduados: number;
  desertores: number;
}

export interface PosgradoFinancingStats {
  propia: number;
  beca: number;
  credito: number;
}

export interface PosgradoComputedStats {
  tasa_sobrepermanencia: number;
  tasa_deserciones: number;
  tasa_retirados_bra: number;
  tasa_graduados_10: number;
  tasa_graduados_mas_10: number;
}

export type PosgradoProgramType = 'MAESTRIA' | 'ESPECIALIZACION';
