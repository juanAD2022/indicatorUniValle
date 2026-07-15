import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, type PieLabelRenderProps } from 'recharts';
import type { GenderPieChartProps, PieDataItem } from './GenderPieChart.types';

const DEFAULT_COLORS = {
  Hombres: '#1565C0',
  Mujeres: '#CC1C1C',
};

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props: PieLabelRenderProps) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    value,
  } = props as {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
    value: number;
  };
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  const innerCx = (innerRadius + outerRadius) / 2 * cos + cx;
  const innerCy = (innerRadius + outerRadius) / 2 * sin + cy;

  return (
    <g>
      {/* Percentage inside the segment */}
      <text x={innerCx} y={innerCy} textAnchor="middle" dominantBaseline="central"
        fontSize={14} fontWeight="bold" fill="#fff" pointerEvents="none">
        {`${(percent * 100).toFixed(0)}%`}
      </text>

      {/* Outer connecting line */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#000" fill="none" strokeWidth={1} />
      <circle cx={ex} cy={ey} r={2} fill="#000" />

      {/* Label text */}
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey - 6} textAnchor={textAnchor} fontSize={13} fill="#333">
        {name}
      </text>
      <line x1={ex + (cos >= 0 ? 1 : -1) * 12} y1={ey - 2}
        x2={ex + (cos >= 0 ? 1 : -1) * 12 + (cos >= 0 ? 1 : -1) * (name.length * 7.5)} y2={ey - 2}
        stroke="#333" strokeWidth={1} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 14} textAnchor={textAnchor} fontSize={12} fill="#666">
        {value}
      </text>
    </g>
  );
};

export const GenderPieChart = ({
  data,
  hombres,
  mujeres,
  title = 'Distribución por Género',
  showLegend = true,
  className = '',
}: GenderPieChartProps) => {
  const chartData: PieDataItem[] = data ?? [
    { name: 'Hombres', value: hombres ?? 0, color: DEFAULT_COLORS.Hombres },
    { name: 'Mujeres', value: mujeres ?? 0, color: DEFAULT_COLORS.Mujeres },
  ];

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
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="40%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(
              value: any,
              name: any
            ) => [
              `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
