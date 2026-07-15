export interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export interface GenderPieChartProps {
  data?: PieDataItem[];
  hombres?: number;
  mujeres?: number;
  title?: string;
  showLegend?: boolean;
  className?: string;
}
