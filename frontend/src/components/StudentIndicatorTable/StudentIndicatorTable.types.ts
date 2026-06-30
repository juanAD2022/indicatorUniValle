import type { StudentIndicator } from '@models/StudentIndicator';

export interface StudentIndicatorTableProps {
  data: StudentIndicator[];
  isLoading?: boolean;
}

export type SortField = 'periodo' | 'estado' | 'sexo' | 'estrato' | 'promedio_acumulado';
export type SortDirection = 'asc' | 'desc';
