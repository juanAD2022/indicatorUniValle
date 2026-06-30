import { api } from '@services/axiosConfig';
import type { StudentIndicator, StudentIndicatorFilters } from '@models/StudentIndicator';

export interface StudentIndicatorStats {
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
