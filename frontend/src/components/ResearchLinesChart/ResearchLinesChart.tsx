import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import type { ResearchLinesChartProps } from './ResearchLinesChart.types';

const COLORS = ['#1565C0', '#4CAF50', '#9C27B0', '#FF9800'];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { label: string; percent: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-sm font-semibold text-gray-800">{item.payload.label}</p>
      <p className="text-sm text-gray-600">
        {item.value} proyectos ({(item.payload.percent * 100).toFixed(1)}%)
      </p>
    </div>
  );
};

export const ResearchLinesChart = ({
  regresion,
  bioestadistica,
  analisis_datos,
  control_estadistico,
  className = '',
}: ResearchLinesChartProps) => {
  const data = [
    { label: 'Análisis de Datos', value: analisis_datos },
    { label: 'Bioestadística', value: bioestadistica },
    { label: 'Regresión', value: regresion },
    { label: 'Control Estadístico', value: control_estadistico },
  ];

  const total = regresion + bioestadistica + analisis_datos + control_estadistico;

  const dataWithPercent = data.map((item) => ({
    ...item,
    percent: total > 0 ? item.value / total : 0,
  }));

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Líneas de investigación</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos para el periodo seleccionado.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Líneas de investigación</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={dataWithPercent}
          layout="vertical"
          margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
        >
          <XAxis type="number" fontSize={12} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            fontSize={11}
            tickLine={false}
            width={130}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={25}>
            {dataWithPercent.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              fontSize={12}
              fill="#333"
              formatter={(value: any) => {
                const num = Number(value);
                const idx = dataWithPercent.findIndex((d) => d.value === num);
                const pct = idx >= 0 ? dataWithPercent[idx].percent : 0;
                return `${num} (${(pct * 100).toFixed(1)}%)`;
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
