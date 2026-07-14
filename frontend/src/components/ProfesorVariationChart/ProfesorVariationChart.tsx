import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { VariationChartData } from '@models/Profesor';

interface ProfesorVariationChartProps {
  data: VariationChartData[];
  className?: string;
}

const COLORS = {
  planta: '#CC1C1C',
  contratistas: '#1565C0',
  asistentes: '#4CAF50',
  comision: '#FF9800',
};

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
          {item.name}: {item.value}%
        </p>
      ))}
    </div>
  );
};

const CustomLegend = ({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) => {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {payload.map((item) => (
        <div key={item.value} className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-gray-700">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ProfesorVariationChart = ({
  data,
  className = '',
}: ProfesorVariationChartProps) => {
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Variación porcentual del número de profesores por categoría
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de tendencia disponibles.
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) =>
    a.periodo.localeCompare(b.periodo)
  );

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Variación porcentual del número de profesores por categoría
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={sortedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="periodo" fontSize={12} tickLine={false} />
          <YAxis fontSize={12} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="planta"
            name="Planta"
            stroke={COLORS.planta}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="contratistas"
            name="Contratistas"
            stroke={COLORS.contratistas}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="asistentes"
            name="Asistentes de docencia"
            stroke={COLORS.asistentes}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="comision"
            name="Comisión de estudios"
            stroke={COLORS.comision}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
