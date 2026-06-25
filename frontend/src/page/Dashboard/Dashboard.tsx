import { useAuth } from '../../context/useAuth';
import { LogOut } from 'lucide-react';

export const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#E8E8F0]">
      <header className="bg-[#CC1C1C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Universidad del Valle" className="h-10 object-contain" />
            <h1 className="text-xl font-bold">Sistema de Indicadores</h1>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[#CC1C1C] mb-4">
            Bienvenido al Dashboard
          </h2>
          <p className="text-gray-600">
            Acá va el contenido principal del sistema de indicadores.
          </p>
        </div>
      </main>
    </div>
  );
};
