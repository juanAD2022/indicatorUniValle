import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import type { ConvocationsBarChartProps } from './ConvocationsBarChart.types';

const COLORS = ['#1565C0', '#4CAF50', '#FF9800'];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { label: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-sm font-semibold text-gray-800">{item.payload.label}</p>
      <p className="text-sm text-gray-600">{item.value} convocatorias</p>
    </div>
  );
};

export const ConvocationsBarChart = ({
  internas,
  externas,
  profesorales,
  className = '',
}: ConvocationsBarChartProps) => {
  const data = [
    { label: 'Internas', value: internas },
    { label: 'Externas', value: externas },
    { label: 'Profesorales', value: profesorales },
  ];

  const total = internas + externas + profesorales;

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Convocatorias por tipo</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Convocatorias por tipo</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="label" fontSize={12} tickLine={false} />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
            <LabelList dataKey="value" position="top" fontSize={12} fill="#333" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
