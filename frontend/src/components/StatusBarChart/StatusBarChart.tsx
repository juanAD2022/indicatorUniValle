import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import type { StatusBarChartProps, StatusBarItem } from './StatusBarChart.types';

const DEFAULT_COLORS = ['#CC1C1C', '#1565C0', '#4CAF50'];

const CustomLegend = ({ items }: { items: StatusBarItem[] }) => (
  <div className="flex flex-wrap justify-center gap-4 mb-2">
    {items.map((item, index) => (
      <div key={item.label} className="flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm"
          style={{ backgroundColor: item.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
        />
        <span className="text-xs text-gray-700">{item.label}</span>
      </div>
    ))}
  </div>
);

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
      <p className="text-sm text-gray-600">{item.value}</p>
    </div>
  );
};

export const StatusBarChart = ({
  data,
  matriculados,
  graduados,
  desertores,
  title = 'Estudiantes por Estado',
  valueLabel: _valueLabel = 'estudiantes',
  colors,
  className = '',
}: StatusBarChartProps) => {
  const chartData: StatusBarItem[] = data ?? [
    { label: 'Matriculados', value: matriculados ?? 0 },
    { label: 'Graduados', value: graduados ?? 0 },
    { label: 'Desertores', value: desertores ?? 0 },
  ];

  const activeColors = colors ?? DEFAULT_COLORS;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">{title}</h3>
      <CustomLegend items={chartData.map((item, i) => ({ ...item, color: item.color ?? activeColors[i % activeColors.length] }))} />
      <ResponsiveContainer width="100%" height={327}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="label" fontSize={12} tickLine={false} />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={35}>
            {chartData.map((item, index) => (
              <Cell key={index} fill={item.color ?? activeColors[index % activeColors.length]} />
            ))}
            <LabelList dataKey="value" position="top" fontSize={12} fill="#333" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
