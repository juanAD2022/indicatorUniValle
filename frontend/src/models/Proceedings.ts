export interface Proceeding {
  id: number;
  file_path: string;
  original_name: string;
  document_type: string;
  document_category: string;
  upload_date: string;
  version: string;
  format: string;
  observation: string | null;
  category_id: number;
  user_id: number;
}

export interface Category {
  id: number;
  name: string;
  base_path: string;
}

export interface ProceedingFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  document_type?: string;
  document_category?: string;
}
