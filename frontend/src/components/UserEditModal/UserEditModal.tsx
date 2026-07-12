import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User } from '@models/User';

const VALID_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'director_escuela', label: 'Director de Escuela' },
  { value: 'secretaria_escuela', label: 'Secretaría de Escuela' },
  { value: 'coordinador_lab', label: 'Coordinador de Laboratorio' },
  { value: 'director_pregrado', label: 'Director de Pregrado' },
  { value: 'secretaria_pregrado', label: 'Secretaría de Pregrado' },
  { value: 'coordinador_posgrado', label: 'Coordinador de Posgrado' },
  { value: 'secretaria_posgrado', label: 'Secretaría de Posgrado' },
  { value: 'grupo_inferir', label: 'Grupo Inferir' },
  { value: 'coordinador_extension', label: 'Coordinador de Extensión' },
];

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: number, data: { email: string; role: string }) => void;
  isLoading?: boolean;
}

export const UserEditModal = ({
  user,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: UserEditModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido.');
      return;
    }

    if (!role) {
      setError('Debe seleccionar un rol.');
      return;
    }

    onSave(user.id, { email: email.trim(), role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Editar Usuario</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* User info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Nombre:</span> {user.full_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Usuario:</span> {user.username}
            </p>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C]"
              placeholder="usuario@correo.com"
            />
          </div>

          {/* Role field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C] bg-white"
            >
              <option value="">Seleccionar rol...</option>
              {VALID_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#CC1C1C] text-white rounded-lg text-sm font-medium hover:bg-[#a81818] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
