import { TrendingUp, Clock, DollarSign } from 'lucide-react';
import type { ExtensionSocial, ExtensionSocialStats } from '@models/ExtensionSocial';

interface AverageCardsProps {
  stats: ExtensionSocialStats;
  data: ExtensionSocial[];
}

export const AverageCards = ({ stats, data }: AverageCardsProps) => {
  const totalActividades = stats.total_conferencias + stats.total_cursos + stats.total_diplomados + stats.total_talleres + stats.total_consultorias;
  const avgAsistentes = totalActividades > 0 ? Math.round(stats.total_asistentes / totalActividades) : 0;
  const avgHoras = data.length > 0 ? Math.round(stats.total_horas / data.length) : 0;
  const avgIngreso = data.length > 0 ? Math.round(stats.total_ingreso_neto / data.length) : 0;

  const cards = [
    {
      label: 'Prom. asistentes / actividad',
      value: avgAsistentes,
      color: '#00ACC1',
      icon: <TrendingUp className="h-5 w-5" strokeWidth={1.5} />,
    },
    {
      label: 'Prom. horas / período',
      value: avgHoras,
      color: '#607D8B',
      icon: <Clock className="h-5 w-5" strokeWidth={1.5} />,
    },
    {
      label: 'Prom. ingreso / período',
      value: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(avgIngreso),
      color: '#4CAF50',
      icon: <DollarSign className="h-5 w-5" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-[#CC1C1C] uppercase tracking-wide">
        Promedios
      </h3>
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: card.color }}
          >
            {card.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="text-lg font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
