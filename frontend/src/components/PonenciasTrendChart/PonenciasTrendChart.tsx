import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { PonenciasTrendChartProps } from './PonenciasTrendChart.types';

const SERIES_CONFIG = [
  { key: 'profesores_vinculados', name: 'Profesores vinculados', color: '#CC1C1C' },
  { key: 'jovenes_investigadores', name: 'Jóvenes investigadores', color: '#1565C0' },
  { key: 'proyectos_desarrollo', name: 'Proyectos en desarrollo', color: '#4CAF50' },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="text-sm" style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
};

export const PonenciasTrendChart = ({ data, className = '' }: PonenciasTrendChartProps) => {
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Tendencia de ponencias</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de tendencia disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Tendencia de ponencias</h3>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {SERIES_CONFIG.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-700">{s.name}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="periodo" fontSize={12} tickLine={false} />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          {SERIES_CONFIG.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
