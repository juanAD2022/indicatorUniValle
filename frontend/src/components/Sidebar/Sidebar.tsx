import { NavLink } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@context/useAuth';
import type { SidebarProps } from './Sidebar.types';

export const Sidebar = ({ sections, collapsed = false, onToggle, onNavigate }: SidebarProps) => {
  const { logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white text-[#1B2A4A] shadow-sm'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <img src="/logo.png" alt="Universidad del Valle" className="h-9 object-contain shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-sm font-bold leading-tight truncate">Escuela de Estadística</p>
            <p className="text-white/60 text-xs truncate">Sistema de Información</p>
          </div>
        )}
      </div>

      {/* Navigation sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkClass}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: Logout + Collapse toggle */}
      <div className="border-t border-white/10 px-3 py-3 space-y-2">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {onToggle && (
          <button
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Colapsar</span>}
          </button>
        )}
      </div>
    </div>
  );
};
