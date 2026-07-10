import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProjectsPieChartProps } from './ProjectsPieChart.types';

const COLORS = {
  'En desarrollo': '#1565C0',
  'Finalizados': '#4CAF50',
  'Cancelados': '#E53935',
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
      <p className="text-sm text-gray-600">
        {item.value} ({(item.payload.percent * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

export const ProjectsPieChart = ({
  desarrollo,
  finalizados,
  cancelados,
  className = '',
}: ProjectsPieChartProps) => {
  const total = desarrollo + finalizados + cancelados;

  const data = [
    { name: 'En desarrollo', value: desarrollo },
    { name: 'Finalizados', value: finalizados },
    { name: 'Cancelados', value: cancelados },
  ].map((item) => ({
    ...item,
    percent: total > 0 ? item.value / total : 0,
  }));

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Proyectos de investigación por estado</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Proyectos de investigación por estado</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="60%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              label={({ cx, cy }: { cx: number; cy: number }) => (
                <g>
                  <text x={cx} y={cy - 8} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#333">
                    {total}
                  </text>
                  <text x={cx} y={cy + 14} textAnchor="middle" fontSize={13} fill="#666">
                    Total
                  </text>
                </g>
              )}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="inline-block w-4 h-4 rounded-sm shrink-0"
                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
              />
              <div className="text-sm">
                <span className="text-gray-700">{item.name}</span>
                <span className="ml-2 font-semibold text-gray-900">{item.value}</span>
                <span className="ml-1 text-gray-500">
                  ({(item.percent * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
