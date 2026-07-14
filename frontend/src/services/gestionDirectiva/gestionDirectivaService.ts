import { api } from '@services/axiosConfig';
import type {
  PlaneacionCurso,
  ProgramacionCurso,
  ApoyoEconomico,
  PlaneacionStats,
  ProgramacionStats,
  ApoyoStats,
} from '@models/GestionDirectiva';

// List endpoints
export const getPlaneacionCursos = async (periodo?: string): Promise<PlaneacionCurso[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<PlaneacionCurso[]>('/gestion-directiva/planeacion', { params });
  return response.data;
};

export const getProgramacionCursos = async (periodo?: string): Promise<ProgramacionCurso[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ProgramacionCurso[]>('/gestion-directiva/programacion', { params });
  return response.data;
};

export const getApoyoEconomico = async (periodo?: string): Promise<ApoyoEconomico[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ApoyoEconomico[]>('/gestion-directiva/apoyo-economico', { params });
  return response.data;
};

// Stats endpoints
export const getPlaneacionStats = async (periodo?: string): Promise<PlaneacionStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<PlaneacionStats>('/gestion-directiva/planeacion/stats', { params });
  return response.data;
};

export const getProgramacionStats = async (periodo?: string): Promise<ProgramacionStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ProgramacionStats>('/gestion-directiva/programacion/stats', { params });
  return response.data;
};

export const getApoyoStats = async (periodo?: string): Promise<ApoyoStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ApoyoStats>('/gestion-directiva/apoyo-economico/stats', { params });
  return response.data;
};

// By periodo endpoint (apoyo)
export const getApoyoByPeriodo = async (periodo: string): Promise<ApoyoEconomico[]> => {
  const response = await api.get<ApoyoEconomico[]>(`/gestion-directiva/apoyo-economico/by-periodo/${periodo}`);
  return response.data;
};
