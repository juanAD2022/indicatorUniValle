import type { StudentIndicator } from '@models/StudentIndicator';

export interface StudentIndicatorTableProps {
  data: StudentIndicator[];
  isLoading?: boolean;
  onImportComplete?: () => void;
  onPeriodChange?: (periodo: string | null) => void;
}

export type SortField = 'periodo' | 'estado' | 'sexo' | 'estrato' | 'promedio_acumulado';
export type SortDirection = 'asc' | 'desc';
