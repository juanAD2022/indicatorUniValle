import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ApoyoDonutChartProps {
  data: Array<{ tipo_evento: string; monto: number }>;
}

const COLORS = ['#1565C0', '#4CAF50', '#FF9800', '#CC1C1C', '#9C27B0', '#00ACC1', '#E91E63'];

export const ApoyoDonutChart = ({ data }: ApoyoDonutChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Apoyo económico por tipo de evento
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.tipo_evento || 'Sin tipo',
    value: Number(item.monto),
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Apoyo económico por tipo de evento
      </h3>
      <div className="flex flex-col items-center gap-2">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                dataKey="value"
                labelLine={false}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => {
                  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                  return [`$${value.toLocaleString()} (${pct}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full flex flex-col gap-1">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="inline-block w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-gray-700 truncate">{entry.name}</span>
              </div>
              <span className="text-xs font-medium text-gray-900 shrink-0">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
