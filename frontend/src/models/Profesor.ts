export interface Profesor {
  id: number;
  periodo: string;
  planta: number;
  contratistas: number;
  asistentes: number;
  comision: number;
  variacion_planta: number;
  variacion_contratistas: number;
  variacion_asistentes: number;
  variacion_comision: number;
  horas_administrativo: number;
  horas_docencia: number;
  horas_extension: number;
  horas_investigacion: number;
}

export interface ProfesorStats {
  total_registros: number;
  total_planta: number;
  total_contratistas: number;
  total_asistentes: number;
  total_comision: number;
  total_horas_administrativo: number;
  total_horas_docencia: number;
  total_horas_extension: number;
  total_horas_investigacion: number;
  promedio_variacion_planta: number;
  promedio_variacion_contratistas: number;
  promedio_variacion_asistentes: number;
  promedio_variacion_comision: number;
}

export interface VariationChartData {
  periodo: string;
  planta: number;
  contratistas: number;
  asistentes: number;
  comision: number;
}

export interface HoursChartData {
  categoria: string;
  horas: number;
}

export interface ProfesorActivo {
  id: number;
  nombre: string;
  categoria: string;
  cvlac: string | null;
  estado: string;
  created_at: string;
}

export interface ProfesorActivoFilters {
  categoria?: string;
  estado?: string;
  search?: string;
}
