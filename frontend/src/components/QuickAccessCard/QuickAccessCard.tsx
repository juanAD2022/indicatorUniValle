import { useNavigate } from 'react-router-dom';
import type { QuickAccessCardProps } from './QuickAccessCard.types';

export const QuickAccessCard = ({ links, className = '' }: QuickAccessCardProps) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Accesos rápidos
      </h3>

      <div className="space-y-2">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-sm font-medium text-gray-700 hover:bg-[#FFF0F0] hover:text-[#CC1C1C] border border-gray-200 hover:border-[#CC1C1C]/30 transition-colors"
          >
            <span className="text-[#1565C0] shrink-0">{link.icon}</span>
            <span className="flex-1">{link.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
