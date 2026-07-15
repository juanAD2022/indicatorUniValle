export interface TrendSeries {
  key: string;
  name: string;
  color: string;
}

export interface TrendLineChartProps {
  data: Array<Record<string, any>>;
  series?: TrendSeries[];
  xAxisKey?: string;
  title?: string;
  className?: string;
}
