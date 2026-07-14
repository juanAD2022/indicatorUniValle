import { api } from '@services/axiosConfig';
import type { Profesor, ProfesorStats, ProfesorActivo, ProfesorActivoFilters } from '@models/Profesor';

export const getProfesores = async (periodo?: string): Promise<Profesor[]> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<Profesor[]>('/profesores/', { params });
  return response.data;
};

export const getProfesorStats = async (periodo?: string): Promise<ProfesorStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<ProfesorStats>('/profesores/stats', { params });
  return response.data;
};

export const getProfesorByPeriodo = async (periodo: string): Promise<Profesor> => {
  const response = await api.get<Profesor>(`/profesores/by-periodo/${periodo}`);
  return response.data;
};

// Profesores Activos (individuales)
export const getProfesoresActivos = async (filters?: ProfesorActivoFilters): Promise<ProfesorActivo[]> => {
  const params: Record<string, string> = {};
  if (filters?.categoria) params.categoria = filters.categoria;
  if (filters?.estado) params.estado = filters.estado;
  if (filters?.search) params.search = filters.search;
  const response = await api.get<ProfesorActivo[]>('/profesores/activos', { params });
  return response.data;
};

export const createProfesorActivo = async (data: Omit<ProfesorActivo, 'id' | 'created_at'>): Promise<ProfesorActivo> => {
  const response = await api.post<ProfesorActivo>('/profesores/activos', data);
  return response.data;
};

export const updateProfesorActivo = async (id: number, data: Partial<Omit<ProfesorActivo, 'id' | 'created_at'>>): Promise<ProfesorActivo> => {
  const response = await api.put<ProfesorActivo>(`/profesores/activos/${id}`, data);
  return response.data;
};

export const deleteProfesorActivo = async (id: number): Promise<void> => {
  await api.delete(`/profesores/activos/${id}`);
};
