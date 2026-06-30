import type { ReactNode } from 'react';

export interface IndicatorCardProps {
  value: number | string;
  label: string;
  subtitle: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}
