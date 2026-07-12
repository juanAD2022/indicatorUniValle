import { useEffect, useState, useCallback } from 'react';
import { UserEditModal } from '@components/UserEditModal';
import { getUsers, updateUser, toggleUserActive } from '@services/userManagement';
import type { User } from '@models/User';
import {
  Users,
  Search,
  Pencil,
  Power,
  PowerOff,
  Shield,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  FlaskConical,
  LineChart,
  Building2,
  School,
  FileText,
  AlertCircle,
} from 'lucide-react';

const ROLE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  admin: { label: 'Administrador', icon: <Shield className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  director_escuela: { label: 'Director Escuela', icon: <Building2 className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  secretaria_escuela: { label: 'Secretaría Escuela', icon: <FileText className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  coordinador_lab: { label: 'Coordinador Lab.', icon: <FlaskConical className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
  director_pregrado: { label: 'Director Pregrado', icon: <GraduationCap className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
  secretaria_pregrado: { label: 'Secretaría Pregrado', icon: <FileText className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
  coordinador_posgrado: { label: 'Coord. Posgrado', icon: <BookOpen className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' },
  secretaria_posgrado: { label: 'Secretaría Posgrado', icon: <FileText className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' },
  grupo_inferir: { label: 'Grupo Inferir', icon: <LineChart className="h-4 w-4" />, color: 'bg-teal-100 text-teal-700' },
  coordinador_extension: { label: 'Coord. Extensión', icon: <School className="h-4 w-4" />, color: 'bg-pink-100 text-pink-700' },
};

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] || { label: role, icon: <ShieldCheck className="h-4 w-4" />, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  useEffect(() => {
    // Get current user role from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserRole(payload.role || '');
      } catch {
        // ignore
      }
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUsers(roleFilter || undefined);
      setUsers(response.users);
    } catch {
      setError('Error al cargar la lista de usuarios.');
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (userId: number, data: { email: string; role: string }) => {
    try {
      setIsSaving(true);
      await updateUser(userId, data);
      setIsModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Error al actualizar el usuario.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (!window.confirm(`¿Está seguro de ${user.is_active ? 'desactivar' : 'activar'} a ${user.full_name}?`)) {
      return;
    }

    try {
      await toggleUserActive(user.id);
      await fetchUsers();
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Error al cambiar el estado del usuario.';
      alert(message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const isAdmin = currentUserRole === 'admin';

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C]">Gestión de Usuarios</h2>
        <p className="text-gray-600 mt-1">
          Administre los usuarios del sistema: edite correos electrónicos y roles.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C]"
            />
          </div>

          {/* Role filter */}
          <div className="sm:w-64">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C] bg-white"
            >
              <option value="">Todos los roles</option>
              {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#CC1C1C]" />
            <p className="text-sm text-gray-500 mt-2">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron usuarios.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-50 transition-colors ${!user.is_active ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1B2A4A] flex items-center justify-center text-white text-sm font-bold">
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <Power className="h-3 w-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#CC1C1C] hover:bg-red-50 transition-colors"
                          title="Editar usuario"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.is_active
                                ? 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                          >
                            {user.is_active ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{filteredUsers.length}</span> de{' '}
              <span className="font-medium">{users.length}</span> usuarios
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setError(null);
        }}
        onSave={handleSave}
        isLoading={isSaving}
      />
    </>
  );
};
