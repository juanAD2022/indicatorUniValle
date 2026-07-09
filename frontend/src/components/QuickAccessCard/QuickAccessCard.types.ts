import type { ReactNode } from 'react';

export interface QuickLink {
  label: string;
  path: string;
  icon: ReactNode;
}

export interface QuickAccessCardProps {
  links: QuickLink[];
  className?: string;
}
