import { Users, GraduationCap, BookOpen } from 'lucide-react';
import type { ExtensionSocialStats } from '@models/ExtensionSocial';

interface ParticipationCardsProps {
  stats: ExtensionSocialStats;
}

export const ParticipationCards = ({ stats }: ParticipationCardsProps) => {
  const total = stats.total_participacion_estudiantil + stats.total_participacion_egresados + stats.total_participacion_profesores;

  const cards = [
    {
      label: 'Estudiantes',
      value: stats.total_participacion_estudiantil,
      color: '#1565C0',
      icon: <GraduationCap className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      label: 'Egresados',
      value: stats.total_participacion_egresados,
      color: '#4CAF50',
      icon: <BookOpen className="h-6 w-6" strokeWidth={1.5} />,
    },
    {
      label: 'Profesores',
      value: stats.total_participacion_profesores,
      color: '#FF9800',
      icon: <Users className="h-6 w-6" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-[#CC1C1C] uppercase tracking-wide">
        Participación
      </h3>
      {cards.map((card) => {
        const percentage = total > 0 ? ((card.value / total) * 100).toFixed(1) : '0.0';
        return (
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
              <p className="text-lg font-bold text-gray-900">{card.value.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{percentage}% del total</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
