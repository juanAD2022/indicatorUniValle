import type { TrendDataPoint } from '@services/studentIndicator';

export interface TrendLineChartProps {
  data: TrendDataPoint[];
  className?: string;
}
