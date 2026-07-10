import type { GrupoInferirIndicator } from '@models/GrupoInferirIndicator';

export interface GrupoInferirTableProps {
  data: GrupoInferirIndicator[];
  isLoading?: boolean;
  onImportComplete?: () => void;
  selectedPeriod?: string | null;
}

export type SortField = keyof GrupoInferirIndicator;
export type SortDirection = 'asc' | 'desc';
