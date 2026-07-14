export interface ExtensionSocial {
  id: number;
  periodo: string;
  conferencias_dictadas: number;
  cursos_ofrecidos: number;
  diplomados_ofrecidos: number;
  talleres_ofrecidos: number;
  consultorias: number;
  asistentes: number;
  horas_ofrecidas: number;
  participacion_estudiantil: number;
  participacion_egresados: number;
  participacion_profesores: number;
  ingreso_neto: number;
}

export interface ExtensionSocialStats {
  total_registros: number;
  total_conferencias: number;
  total_cursos: number;
  total_diplomados: number;
  total_talleres: number;
  total_consultorias: number;
  total_asistentes: number;
  total_horas: number;
  total_participacion_estudiantil: number;
  total_participacion_egresados: number;
  total_participacion_profesores: number;
  total_ingreso_neto: number;
  promedio_ingreso_neto: number;
}

// Chart data types
export interface ActivitiesChartData {
  periodo: string;
  conferencias: number;
  cursos: number;
  diplomados: number;
  talleres: number;
  consultorias: number;
}

export interface EvolutionChartData {
  periodo: string;
  asistentes: number;
  ingreso_neto: number;
}

export interface ParticipationChartData {
  name: string;
  value: number;
}
