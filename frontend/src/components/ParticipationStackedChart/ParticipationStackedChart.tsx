import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ParticipationStackedChartProps {
  data: Array<{ name: string; asistentes: number; cancelados: number }>;
}

export const ParticipationStackedChart = ({ data }: ParticipationStackedChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Participación de estudiantes asistentes vs permanentes
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Participación de estudiantes asistentes vs permanentes
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" fontSize={11} tickLine={false} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="asistentes" stackId="a" fill="#1565C0" name="Asistentes" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancelados" stackId="a" fill="#CC1C1C" name="Cancelados" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
