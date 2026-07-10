import type { BaseLaboratorio } from '@models/BaseLaboratorio';

export interface BaseLaboratorioTableProps {
  data: BaseLaboratorio[];
  isLoading?: boolean;
  onImportComplete?: () => void;
  selectedPeriod?: string | null;
}

export type SortField = keyof BaseLaboratorio;
export type SortDirection = 'asc' | 'desc';
