import { api } from '@services/axiosConfig';

export interface EstudiantesPorTipo {
  pregrado: number;
  posgrado: number;
  maestria: number;
}

export interface DashboardStats {
  estudiantes_activos_total: number;
  estudiantes_por_tipo: EstudiantesPorTipo;
  profesores: number;
  usuarios_laboratorio: number;
  documentos: number;
  publicaciones: number;
  cursos_extension: number;
}

export const getDashboardStats = async (periodo?: string): Promise<DashboardStats> => {
  const params: Record<string, string> = {};
  if (periodo) params.periodo = periodo;
  const response = await api.get<DashboardStats>('/dashboard/stats', { params });
  return response.data;
};
