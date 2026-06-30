import { api } from '@services/axiosConfig';

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportChange {
  row: number;
  periodo: string;
  action: string;
  fields_changed: string[];
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
}

export interface ImportPendingRow {
  action: string;
  row: number;
  data: Record<string, unknown>;
  record_id?: number;
  old?: Record<string, unknown>;
}

export interface ImportPreview {
  filename: string;
  total_rows: number;
  to_create: number;
  to_update: number;
  unchanged: number;
  errors: ImportError[];
  sample_changes: ImportChange[];
  pending_rows: ImportPendingRow[];
}

export interface ImportResult {
  success: boolean;
  created: number;
  updated: number;
  message: string;
}

export const uploadPreview = async (file: File): Promise<ImportPreview> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ImportPreview>('/import/preview', formData, {
    headers: { 'Content-Type': false },
  });
  return response.data;
};

export const confirmImport = async (rows: ImportPendingRow[]): Promise<ImportResult> => {
  const response = await api.post<ImportResult>('/import/confirm', { rows });
  return response.data;
};
