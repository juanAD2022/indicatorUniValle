import { GraduationCap } from 'lucide-react';
import type { IndicatorCardProps } from './IndicatorCard.types';

export const IndicatorCard = ({
  value,
  label,
  subtitle,
  description,
  icon,
  bgColor = '#CC1C1C',
  className = '',
}: IndicatorCardProps) => {
  // Detectar si el valor es texto largo (no numérico)
  const isTextValue = typeof value === 'string' && value.length > 3;

  return (
    <div
      className={`rounded-2xl p-5 flex items-center gap-3 shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={`font-bold text-white leading-tight ${isTextValue ? 'text-3xl break-words max-w-[120px]' : 'text-5xl'}`}>
        {value}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-white leading-tight">{label}</p>
        <p className="text-xs text-white/80 truncate mt-0.5">{subtitle}</p>
      </div>

      <div className={`shrink-0 text-white/30 ${isTextValue ? 'scale-75' : ''}`}>
        {icon ?? <GraduationCap className="h-16 w-16" strokeWidth={1.5} />}
      </div>

      {description && (
        <p className="absolute bottom-2 left-6 text-xs text-white/60 uppercase tracking-wider">
          {description}
        </p>
      )}
    </div>
  );
};
