import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';
import type { StatusBarChartProps } from './StatusBarChart.types';

const COLORS = ['#CC1C1C', '#1565C0', '#4CAF50', '#FF9800'];

const LEGEND_ITEMS = [
  { value: 'Matriculados', color: COLORS[0] },
  { value: 'Graduados', color: COLORS[1] },
  { value: 'Reingresados', color: COLORS[2] },
  { value: 'Amnistía', color: COLORS[3] },
];

const CustomLegend = () => (
  <div className="flex flex-wrap justify-center gap-4 mb-2">
    {LEGEND_ITEMS.map((item) => (
      <div key={item.value} className="flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
        <span className="text-xs text-gray-700">{item.value}</span>
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
      <p className="text-sm text-gray-600">{item.value} estudiantes</p>
    </div>
  );
};

export const StatusBarChart = ({
  matriculados,
  graduados,
  reingresados,
  por_amnistia,
  className = '',
}: StatusBarChartProps) => {
  const data = [
    { label: 'Matriculados', value: matriculados },
    { label: 'Graduados', value: graduados },
    { label: 'Reingresados', value: reingresados },
    { label: 'Amnistía', value: por_amnistia },
  ];

  const total = matriculados + graduados + reingresados + por_amnistia;

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Estudiantes por Estado</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Estudiantes por Estado</h3>
      <CustomLegend />
      <BarChart
        width={400}
        height={300}
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
    </div>
  );
};
