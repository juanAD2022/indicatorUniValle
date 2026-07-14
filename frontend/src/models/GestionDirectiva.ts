export interface PlaneacionCurso {
  id: number;
  periodo: string;
  curso: string;
  cupos_solicitados: number;
  grupos_estimados: number;
  cupo_grupo: number;
  grupos_aprobados: number;
}

export interface ProgramacionCurso {
  id: number;
  periodo: string;
  curso: string;
  grupo: string;
  profesor: string | null;
  vinculacion: string | null;
  horario: string | null;
  edificio: string | null;
  salon: string | null;
  matriculados: number;
  cancelaron: number;
  aprobaron: number;
  reprobaron: number;
}

export interface ApoyoEconomico {
  id: number;
  periodo: string;
  nivel: string | null;
  tipo_evento: string | null;
  lugar: string | null;
  pais: string | null;
  participantes: number;
  rol: string | null;
  apoyo_economico: number;
}

export interface PlaneacionStats {
  total_cursos: number;
  total_cupos_solicitados: number;
  total_grupos_estimados: number;
  total_grupos_aprobados: number;
  promedio_cupo_grupo: number;
}

export interface ProgramacionStats {
  total_grupos: number;
  total_matriculados: number;
  total_cancelaron: number;
  total_aprobaron: number;
  total_reprobaron: number;
  tasa_aprobacion: number;
  tasa_cancelacion: number;
}

export interface ApoyoStats {
  total_eventos: number;
  total_participantes: number;
  total_apoyo_economico: number;
  promedio_apoyo_economico: number;
}

// Chart data types
export interface DemandChartData {
  curso: string;
  cupos_solicitados: number;
  matriculados: number;
}

export interface ParticipationChartData {
  name: string;
  asistentes: number;
  cancelados: number;
}

export interface VinculacionChartData {
  name: string;
  value: number;
}

export interface CancelacionChartData {
  horario: string;
  cancelados: number;
}

export interface ApoyoChartData {
  tipo_evento: string;
  monto: number;
}
