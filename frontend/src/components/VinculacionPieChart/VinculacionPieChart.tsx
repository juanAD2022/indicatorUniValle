import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface VinculacionPieChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ['#1565C0', '#4CAF50', '#FF9800', '#CC1C1C', '#9C27B0'];

export const VinculacionPieChart = ({ data }: VinculacionPieChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Vinculación docente
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
        Vinculación docente
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
            labelLine={false}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: unknown) => {
            const num = Number(value);
            return [`${num} (${((num / total) * 100).toFixed(1)}%)`, ''];
          }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
