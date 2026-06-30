export interface Proceeding {
  id: number;
  file_path: string;
  original_name: string;
  category_id: number;
  upload_date: string;
  observation: string | null;
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
}
