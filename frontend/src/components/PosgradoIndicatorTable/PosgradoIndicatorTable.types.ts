import type { PosgradoIndicator, PosgradoProgramType } from '@models/PosgradoIndicator';

export interface PosgradoIndicatorTableProps {
  data: PosgradoIndicator[];
  isLoading?: boolean;
  tipoPrograma: PosgradoProgramType;
  onImportComplete?: () => void;
  selectedPeriod?: string | null;
}

export type SortField = 'periodo' | 'matriculados' | 'graduados' | 'desertores' | 'promedio_acumulado' | 'hombres' | 'mujeres' | 'empleados' | 'desempleados' | 'ponencias' | 'publicaciones';
export type SortDirection = 'asc' | 'desc';
