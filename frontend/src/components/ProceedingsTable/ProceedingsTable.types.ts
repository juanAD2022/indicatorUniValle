export interface ProceedingsTableProps {
  categoryId: number;
}

export type SortField =
  | 'original_name'
  | 'document_type'
  | 'document_category'
  | 'upload_date'
  | 'version'
  | 'format'
  | 'observation';
export type SortDirection = 'asc' | 'desc';
