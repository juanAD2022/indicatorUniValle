import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ExtensionSocialStats } from '@models/ExtensionSocial';

interface ActivitiesDonutChartProps {
  stats: ExtensionSocialStats;
}

const COLORS = ['#1565C0', '#4CAF50', '#FF9800', '#9C27B0', '#CC1C1C'];

export const ActivitiesDonutChart = ({ stats }: ActivitiesDonutChartProps) => {
  const data = [
    { name: 'Conferencias', value: stats.total_conferencias },
    { name: 'Cursos', value: stats.total_cursos },
    { name: 'Diplomados', value: stats.total_diplomados },
    { name: 'Talleres', value: stats.total_talleres },
    { name: 'Consultorías', value: stats.total_consultorias },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Distribución de actividades
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Distribución de actividades
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown, name: unknown) => {
              const num = Number(value);
              const pct = total > 0 ? ((num / total) * 100).toFixed(1) : '0';
              return [`${num} (${pct}%)`, String(name)];
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
