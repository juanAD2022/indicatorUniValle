import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CancelacionHorarioChartProps {
  data: Array<{ horario: string; cancelados: number }>;
}

export const CancelacionHorarioChart = ({ data }: CancelacionHorarioChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Cancelaciones vs horario de grupo
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
        Cancelaciones vs horario de grupo
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <XAxis dataKey="horario" fontSize={11} tickLine={false} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Bar dataKey="cancelados" fill="#FF9800" name="Cancelados" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
