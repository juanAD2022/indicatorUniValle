export interface StatusBarItem {
  label: string;
  value: number;
  color?: string;
}

export interface StatusBarChartProps {
  data?: StatusBarItem[];
  matriculados?: number;
  graduados?: number;
  desertores?: number;
  title?: string;
  valueLabel?: string;
  colors?: string[];
  className?: string;
}
