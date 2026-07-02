import type { ReactNode } from 'react';

export interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}
