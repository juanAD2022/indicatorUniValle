import { AlertsTable } from '@components/AlertsTable';
import { FileBarChart } from 'lucide-react';

export const Reportes = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#CC1C1C] flex items-center gap-2">
          <FileBarChart className="h-7 w-7" />
          Reportes y Alertas
        </h2>
        <p className="text-gray-600 mt-1">
          Gestiona las alertas y reportes del sistema. Crea, edita y da seguimiento a cada registro.
        </p>
      </div>

      <AlertsTable />
    </>
  );
};
