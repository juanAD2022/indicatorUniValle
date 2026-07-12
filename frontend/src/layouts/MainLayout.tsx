import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '@components/Sidebar';
import { useAuth } from '@context/useAuth';
import { usePeriod } from '@context/usePeriod';
import {
  Home,
  GraduationCap,
  BookOpen,
  School,
  FlaskConical,
  LineChart,
  Building2,
  Users,
  FileUp,
  Database,
  FileBarChart,
} from 'lucide-react';
import type { SidebarSection } from '@components/Sidebar';

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'MÓDULOS',
    items: [
      { label: 'Inicio', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
      { label: 'Pregrado', path: '/pregrado', icon: <GraduationCap className="h-5 w-5" /> },
      { label: 'Posgrado', path: '/posgrado', icon: <BookOpen className="h-5 w-5" /> },
      { label: 'Extensión', path: '/extension-educacion', icon: <School className="h-5 w-5" /> },
      { label: 'Laboratorio', path: '/laboratorio', icon: <FlaskConical className="h-5 w-5" /> },
      { label: 'Grupo Inferir', path: '/grupo-inferir', icon: <LineChart className="h-5 w-5" /> },
      { label: 'Gestión Directiva', path: '/gestion-directiva', icon: <Building2 className="h-5 w-5" /> },
    ],
  },
  {
    title: 'GESTIÓN',
    items: [
      { label: 'Usuarios', path: '/usuarios', icon: <Users className="h-5 w-5" /> },
      { label: 'Carga de Documentos', path: '/carga-documentos', icon: <FileUp className="h-5 w-5" /> },
      { label: 'Carga de BD para Indicadores', path: '/carga-bd', icon: <Database className="h-5 w-5" /> },
      { label: 'Generar Reportes y Alertas', path: '/reportes', icon: <FileBarChart className="h-5 w-5" /> },
    ],
  },
];

function getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

function filterSectionsByRole(sections: SidebarSection[]): SidebarSection[] {
  const role = getUserRoleFromToken();
  const allowedRoles = ['admin', 'coordinador_lab'];
  const canManageUsers = role ? allowedRoles.includes(role) : false;

  return sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.path === '/usuarios') {
        return canManageUsers;
      }
      return true;
    }),
  }));
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Panel de control',
  '/pregrado': 'Pregrado',
  '/posgrado': 'Posgrado',
  '/extension-educacion': 'Extensión/Educación',
  '/laboratorio': 'Laboratorio',
  '/grupo-inferir': 'Grupo Inferir',
  '/gestion-directiva': 'Gestión Directiva',
  '/usuarios': 'Usuarios',
  '/carga-documentos': 'Carga de Documentos',
  '/carga-bd': 'Carga de Base de Datos',
  '/reportes': 'Reportes y Alertas',
};

export const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { token } = useAuth();
  const { selectedPeriod, setSelectedPeriod, availablePeriods } = usePeriod();

  const sidebarSections = filterSectionsByRole(SIDEBAR_SECTIONS);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Panel de control';

  const getUserName = (): string => {
    if (!token) return 'Administrador';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.nombre || payload.email || payload.sub || 'Administrador';
    } catch {
      return 'Administrador';
    }
  };
  const userName = getUserName();

  return (
    <div className="min-h-screen bg-[#E8E8F0]">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-[#1B2A4A] transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-[260px]'
        }`}
      >
        <Sidebar
          sections={sidebarSections}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[260px] bg-[#1B2A4A] transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-3 z-10">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <Sidebar
          sections={sidebarSections}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            {/* Left: hamburger (mobile) + title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">¡Bienvenido!</h1>
                <p className="text-sm text-gray-500">
                  {pageTitle} - Escuela de Estadística
                </p>
              </div>
            </div>

            {/* Right: period selector + user */}
            <div className="flex items-center gap-4">
              {/* Period selector */}
              <div className="hidden sm:flex items-center gap-2">
                <label className="text-sm text-gray-500">Periodo académico</label>
                <select
                  value={selectedPeriod || ''}
                  onChange={(e) => setSelectedPeriod(e.target.value || null)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C]"
                >
                  <option value="">Todos</option>
                  {availablePeriods.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* User avatar */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
