import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import type { AlertsSummaryCardProps } from './AlertsSummaryCard.types';

const MOCK_ALERTS = [
  {
    id: 1,
    text: '5 profesores sin CVLAC actualizado',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  },
  {
    id: 2,
    text: 'Base de datos 2026-1 pendiente por cargar',
    icon: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  },
  {
    id: 3,
    text: 'Registro calificado vence en 6 meses',
    icon: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
  },
  {
    id: 4,
    text: 'Informe de seguimiento pendiente',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  },
];

export const AlertsSummaryCard = ({ className = '' }: AlertsSummaryCardProps) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Alertas y Reportes
      </h3>

      <ul className="space-y-3">
        {MOCK_ALERTS.map((alert) => (
          <li
            key={alert.id}
            className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
          >
            {alert.icon}
            <span className="text-sm text-gray-800">{alert.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
