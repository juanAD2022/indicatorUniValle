import { api } from '@services/axiosConfig';
import type { Proceeding, Category, ProceedingFilters } from '@models/Proceedings';

export const getProceedings = async (
  categoryId: number,
  filters?: ProceedingFilters
): Promise<Proceeding[]> => {
  const params: Record<string, string | number> = { category_id: categoryId };

  if (filters?.search) params.search = filters.search;
  if (filters?.dateFrom) params.date_from = filters.dateFrom;
  if (filters?.dateTo) params.date_to = filters.dateTo;

  const response = await api.get<Proceeding[]>('/proceedings', { params });
  return response.data;
};

export const uploadProceeding = async (
  file: File,
  categoryId: number,
  observation?: string
): Promise<Proceeding> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category_id', categoryId.toString());
  if (observation) {
    formData.append('observation', observation);
  }

  const response = await api.post<Proceeding>('/proceedings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProceeding = async (id: number): Promise<void> => {
  await api.delete(`/proceedings/${id}`);
};

export const getDownloadUrl = (id: number): string => {
  const baseURL = api.defaults.baseURL;
  return `${baseURL}/proceedings/${id}/download`;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};
