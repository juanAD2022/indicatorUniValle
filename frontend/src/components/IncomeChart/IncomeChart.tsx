import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface IncomeChartProps {
  data: Array<{ periodo: string; ingreso_neto: number }>;
}

export const IncomeChart = ({ data }: IncomeChartProps) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
          Ingresos netos por período
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Ingresos netos por período
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <XAxis dataKey="periodo" fontSize={11} tickLine={false} />
          <YAxis fontSize={11} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
          <Tooltip
            formatter={(value: unknown) => formatCurrency(Number(value))}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Bar dataKey="ingreso_neto" fill="#4CAF50" name="Ingreso neto" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
