import { GraduationCap } from 'lucide-react';
import type { IndicatorCardProps } from './IndicatorCard.types';

export const IndicatorCard = ({
  value,
  label,
  subtitle,
  description,
  icon,
  className = '',
}: IndicatorCardProps) => {
  return (
    <div
      className={`bg-[#CC1C1C] rounded-2xl p-6 flex items-center gap-4 shadow-sm ${className}`}
    >
      <div className="text-5xl font-bold text-white leading-none">{value}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold uppercase tracking-wide text-white">{label}</p>
        <p className="text-sm text-white/80 truncate">{subtitle}</p>
      </div>

      <div className="shrink-0 text-white/30">
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
