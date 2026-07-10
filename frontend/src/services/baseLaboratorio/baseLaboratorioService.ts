import { api } from '@services/axiosConfig';
import type {
  BaseLaboratorio,
  BaseLaboratorioStats,
  BaseLaboratorioTrendDataPoint,
  BaseLaboratorioUserDistribution,
} from '@models/BaseLaboratorio';

export const getBaseLaboratorioIndicators = async (
  periodo?: string
): Promise<BaseLaboratorio[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<BaseLaboratorio[]>('/base-laboratorio', { params });
  return response.data;
};

export const getBaseLaboratorioStats = async (
  periodo?: string
): Promise<BaseLaboratorioStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<BaseLaboratorioStats>('/base-laboratorio/stats', { params });
  return response.data;
};

export const getBaseLaboratorioTrendData = async (): Promise<BaseLaboratorioTrendDataPoint[]> => {
  const response = await api.get<BaseLaboratorioTrendDataPoint[]>('/base-laboratorio/trend');
  return response.data;
};

export const getBaseLaboratorioUserDistribution = async (
  periodo?: string
): Promise<BaseLaboratorioUserDistribution> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<BaseLaboratorioUserDistribution>('/base-laboratorio/user-distribution', {
    params,
  });
  return response.data;
};
