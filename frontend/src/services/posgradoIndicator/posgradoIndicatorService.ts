import { api } from '@services/axiosConfig';
import type {
  PosgradoIndicator,
  PosgradoIndicatorStats,
  PosgradoGenderStats,
  PosgradoTrendDataPoint,
  PosgradoFinancingStats,
  PosgradoProgramType,
} from '@models/PosgradoIndicator';

export const getPosgradoIndicators = async (
  tipoPrograma?: PosgradoProgramType,
  periodo?: string
): Promise<PosgradoIndicator[]> => {
  const params: Record<string, string> = {};
  if (tipoPrograma) params.tipo_programa = tipoPrograma;
  if (periodo) params.periodo = periodo;

  const response = await api.get<PosgradoIndicator[]>('/posgrado-indicators', { params });
  return response.data;
};

export const getPosgradoIndicatorStats = async (
  periodo?: string,
  tipoPrograma?: PosgradoProgramType
): Promise<PosgradoIndicatorStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  if (tipoPrograma) params.tipo_programa = tipoPrograma;

  const response = await api.get<PosgradoIndicatorStats>('/posgrado-indicators/stats', { params });
  return response.data;
};

export const getPosgradoGenderStats = async (
  periodo?: string,
  tipoPrograma?: PosgradoProgramType
): Promise<PosgradoGenderStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  if (tipoPrograma) params.tipo_programa = tipoPrograma;

  const response = await api.get<PosgradoGenderStats>('/posgrado-indicators/gender-stats', { params });
  return response.data;
};

export const getPosgradoTrendData = async (
  tipoPrograma?: PosgradoProgramType
): Promise<PosgradoTrendDataPoint[]> => {
  const params: Record<string, string> = {};
  if (tipoPrograma) params.tipo_programa = tipoPrograma;

  const response = await api.get<PosgradoTrendDataPoint[]>('/posgrado-indicators/trend', { params });
  return response.data;
};

export const getPosgradoFinancingStats = async (
  periodo?: string,
  tipoPrograma?: PosgradoProgramType
): Promise<PosgradoFinancingStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  if (tipoPrograma) params.tipo_programa = tipoPrograma;

  const response = await api.get<PosgradoFinancingStats>('/posgrado-indicators/financing-stats', { params });
  return response.data;
};
