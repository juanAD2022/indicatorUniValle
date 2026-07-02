import type { StudentIndicator } from '@models/StudentIndicator';

export interface StudentIndicatorTableProps {
  data: StudentIndicator[];
  isLoading?: boolean;
  tipo_programa: string;
  onImportComplete?: () => void;
  onPeriodChange?: (periodo: string | null) => void;
}

export type SortField = 'periodo' | 'estado' | 'vinculacion' | 'sexo' | 'estrato' | 'promedio_acumulado';
export type SortDirection = 'asc' | 'desc';
