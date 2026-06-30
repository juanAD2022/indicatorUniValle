import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@context/useAuth';
import type { NavBarProps } from './NavBar.types';

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'Gestión Directiva', path: '/gestion-directiva' },
  { label: 'Pregrado', path: '/pregrado' },
  { label: 'Posgrado', path: '/posgrado' },
  { label: 'Laboratorio', path: '/laboratorio' },
  { label: 'Grupo Inferir', path: '/grupo-inferir' },
  { label: 'Extensión/Educación', path: '/extension-educacion' },
];

import type { NavItem } from './NavBar.types';

export const NavBar = ({ items = DEFAULT_ITEMS }: NavBarProps) => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-white text-[#CC1C1C]'
        : 'text-white hover:bg-[#FFF0F0] hover:text-[#CC1C1C]'
    }`;

  return (
    <nav className="bg-[#CC1C1C] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/dashboard" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Universidad del Valle" className="h-9 object-contain" />
        </NavLink>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-1">
          {items.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Logout pill */}
        <button
          onClick={logout}
          className="hidden md:flex items-center gap-2 bg-white hover:bg-[#FFF0F0] text-[#CC1C1C] font-semibold px-5 py-2 rounded-full text-sm transition-colors shrink-0"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full bg-white text-[#CC1C1C] font-semibold px-4 py-2 rounded-full text-sm mt-2"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      )}
    </nav>
  );
};
