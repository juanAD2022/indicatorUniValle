import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { getAlerts } from '@services/alerts';
import type { Alert } from '@models/Alert';
import type { AlertsSummaryCardProps } from './AlertsSummaryCard.types';

const getAlertIcon = (tipo: string, estado: string) => {
  if (estado === 'FINALIZADO') {
    return <Info className="h-5 w-5 text-gray-400 shrink-0" />;
  }
  switch (tipo) {
    case 'ALERTA':
      return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
    case 'REPORTE':
      return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
    default:
      return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
  }
};

const getAlertColor = (tipo: string, estado: string) => {
  if (estado === 'FINALIZADO') {
    return 'text-gray-500';
  }
  switch (tipo) {
    case 'ALERTA':
      return 'text-amber-700';
    case 'REPORTE':
      return 'text-red-700';
    default:
      return 'text-blue-700';
  }
};

export const AlertsSummaryCard = ({ className = '' }: AlertsSummaryCardProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getAlerts();
      // Show only the last 5 alerts
      setAlerts(result.slice(0, 5));
    } catch {
      // Silenciar error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Alertas y Reportes
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
          Cargando alertas...
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
          No tienes alertas ni reportes.
        </div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 ${
                alert.estado === 'FINALIZADO' ? 'opacity-60' : ''
              }`}
            >
              {getAlertIcon(alert.tipo, alert.estado)}
              <span className={`text-sm flex-1 ${getAlertColor(alert.tipo, alert.estado)}`}>
                {alert.nombre}
              </span>
              {alert.estado === 'FINALIZADO' && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Finalizado
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
