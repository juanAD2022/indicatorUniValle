import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import type { HoursChartData } from '@models/Profesor';

interface ProfesorHoursChartProps {
  data: HoursChartData[];
  className?: string;
}

const COLORS = ['#CC1C1C', '#1565C0', '#4CAF50', '#FF9800'];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: HoursChartData }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-sm font-semibold text-gray-800">{item.categoria}</p>
      <p className="text-sm text-gray-600">{item.horas} horas promedio</p>
    </div>
  );
};

const CustomLabel = (props: { x?: number; y?: number; value?: number }) => {
  const { x, y, value } = props;
  if (x == null || y == null || value == null) return null;
  return (
    <text
      x={x}
      y={y - 8}
      fill="#374151"
      textAnchor="middle"
      fontSize={12}
      fontWeight={600}
    >
      {value}
    </text>
  );
};

export const ProfesorHoursChart = ({
  data,
  className = '',
}: ProfesorHoursChartProps) => {
  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Distribución de horas (Promedio por semestre vs actividad)
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Distribución de horas (Promedio por semestre vs actividad)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="categoria" fontSize={12} tickLine={false} />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="horas" radius={[4, 4, 0, 0]} barSize={50}>
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
