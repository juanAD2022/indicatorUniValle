import { api } from '@services/axiosConfig';
import type { StudentIndicator, StudentIndicatorFilters } from '@models/StudentIndicator';

export interface StudentIndicatorStats {
  matriculados: number;
  graduados: number;
  reingresados: number;
  por_amnistia: number;
}

export interface GenderStats {
  hombres: number;
  mujeres: number;
}

export interface TrendDataPoint {
  periodo: string;
  matriculados: number;
  graduados: number;
  reingresados: number;
  por_amnistia: number;
}

export const getStudentIndicators = async (
  filters?: StudentIndicatorFilters
): Promise<StudentIndicator[]> => {
  const params: Record<string, string | number> = {};

  if (filters?.periodo) params.periodo = filters.periodo;
  if (filters?.estado) params.estado = filters.estado;
  if (filters?.sexo) params.sexo = filters.sexo;
  if (filters?.estrato) params.estrato = filters.estrato;

  const response = await api.get<StudentIndicator[]>('/student-indicators', { params });
  return response.data;
};

export const getStudentIndicatorStats = async (
  periodo?: string
): Promise<StudentIndicatorStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<StudentIndicatorStats>('/student-indicators/stats', { params });
  return response.data;
};

export const getGenderStats = async (periodo?: string): Promise<GenderStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GenderStats>('/student-indicators/gender-stats', { params });
  return response.data;
};

export const getTrendData = async (): Promise<TrendDataPoint[]> => {
  const response = await api.get<TrendDataPoint[]>('/student-indicators/trend');
  return response.data;
};
