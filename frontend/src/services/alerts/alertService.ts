import { api } from '@services/axiosConfig';
import type { Alert, AlertFilters } from '@models/Alert';

export const getAlerts = async (filters?: AlertFilters): Promise<Alert[]> => {
  const params: Record<string, string> = {};

  if (filters?.search) params.search = filters.search;
  if (filters?.tipo) params.tipo = filters.tipo;
  if (filters?.estado) params.estado = filters.estado;

  const response = await api.get<Alert[]>('/alerts', { params });
  return response.data;
};

export const createAlert = async (data: {
  nombre: string;
  descripcion?: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin?: string;
}): Promise<Alert> => {
  const response = await api.post<Alert>('/alerts', data);
  return response.data;
};

export const updateAlert = async (
  id: number,
  data: {
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    estado?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
  }
): Promise<Alert> => {
  const response = await api.put<Alert>(`/alerts/${id}`, data);
  return response.data;
};

export const deleteAlert = async (id: number): Promise<void> => {
  await api.delete(`/alerts/${id}`);
};
