import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { GenderPieChartProps } from './GenderPieChart.types';

const COLORS = {
  Hombres: '#1565C0',
  Mujeres: '#CC1C1C',
};

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  value,
}: PieLabelProps) => {
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

export const GenderPieChart = ({ hombres, mujeres, className = '' }: GenderPieChartProps) => {
  const total = hombres + mujeres;

  const data = [
    { name: 'Hombres', value: hombres },
    { name: 'Mujeres', value: mujeres },
  ];

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Distribución por Género</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Distribución por Género</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="40%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={renderCustomLabel}
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name as keyof typeof COLORS]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
            name,
          ]}
        />
      </PieChart>
    </div>
  );
};
