import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ActivitiesChartData } from '@models/ExtensionSocial';

interface TrendsLineChartProps {
  data: ActivitiesChartData[];
}

export const TrendsLineChart = ({ data }: TrendsLineChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Tendencias históricas
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => a.periodo.localeCompare(b.periodo));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Tendencias históricas
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={sortedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="periodo" fontSize={11} tickLine={false} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Line type="monotone" dataKey="conferencias" stroke="#1565C0" strokeWidth={2} dot={{ r: 3 }} name="Conferencias" />
          <Line type="monotone" dataKey="cursos" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} name="Cursos" />
          <Line type="monotone" dataKey="diplomados" stroke="#FF9800" strokeWidth={2} dot={{ r: 3 }} name="Diplomados" />
          <Line type="monotone" dataKey="talleres" stroke="#9C27B0" strokeWidth={2} dot={{ r: 3 }} name="Talleres" />
          <Line type="monotone" dataKey="consultorias" stroke="#CC1C1C" strokeWidth={2} dot={{ r: 3 }} name="Consultorías" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
