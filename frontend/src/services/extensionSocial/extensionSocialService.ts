import { api } from '@services/axiosConfig';
import type {
  ExtensionSocial,
  ExtensionSocialStats,
} from '@models/ExtensionSocial';

// List endpoints
export const getExtensionSocial = async (periodo?: string): Promise<ExtensionSocial[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ExtensionSocial[]>('/extension-social/', { params });
  return response.data;
};

// Stats endpoints
export const getExtensionSocialStats = async (periodo?: string): Promise<ExtensionSocialStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ExtensionSocialStats>('/extension-social/stats', { params });
  return response.data;
};

// By periodo endpoint
export const getExtensionSocialByPeriodo = async (periodo: string): Promise<ExtensionSocial> => {
  const response = await api.get<ExtensionSocial>(`/extension-social/by-periodo/${periodo}`);
  return response.data;
};
