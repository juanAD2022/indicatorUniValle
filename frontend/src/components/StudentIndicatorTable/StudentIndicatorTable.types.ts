import type { CohortSummary } from '@models/StudentIndicator';

export interface StudentIndicatorTableProps {
  data: CohortSummary[];
  isLoading?: boolean;
  tipo_programa: string;
  onImportComplete?: () => void;
  selectedPeriod?: string | null;
}

export type SortField = keyof CohortSummary;
export type SortDirection = 'asc' | 'desc';
