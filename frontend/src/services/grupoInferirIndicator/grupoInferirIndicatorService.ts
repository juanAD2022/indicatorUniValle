import { api } from '@services/axiosConfig';
import type {
  GrupoInferirIndicator,
  GrupoInferirIndicatorStats,
  GrupoInferirTrendDataPoint,
  GrupoInferirFinancingStats,
  GrupoInferirLinesStats,
  GrupoInferirParticipationStats,
} from '@models/GrupoInferirIndicator';

export const getGrupoInferirIndicators = async (
  periodo?: string
): Promise<GrupoInferirIndicator[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GrupoInferirIndicator[]>('/grupo-inferir-indicators', { params });
  return response.data;
};

export const getGrupoInferirStats = async (
  periodo?: string
): Promise<GrupoInferirIndicatorStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GrupoInferirIndicatorStats>('/grupo-inferir-indicators/stats', { params });
  return response.data;
};

export const getGrupoInferirTrendData = async (): Promise<GrupoInferirTrendDataPoint[]> => {
  const response = await api.get<GrupoInferirTrendDataPoint[]>('/grupo-inferir-indicators/trend');
  return response.data;
};

export const getGrupoInferirFinancingStats = async (
  periodo?: string
): Promise<GrupoInferirFinancingStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GrupoInferirFinancingStats>('/grupo-inferir-indicators/financing-stats', { params });
  return response.data;
};

export const getGrupoInferirLinesStats = async (
  periodo?: string
): Promise<GrupoInferirLinesStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GrupoInferirLinesStats>('/grupo-inferir-indicators/lines-stats', { params });
  return response.data;
};

export const getGrupoInferirParticipationStats = async (
  periodo?: string
): Promise<GrupoInferirParticipationStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;

  const response = await api.get<GrupoInferirParticipationStats>('/grupo-inferir-indicators/participation-stats', { params });
  return response.data;
};
