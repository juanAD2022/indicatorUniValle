import type { FinancingTableProps } from './FinancingTable.types';

export const FinancingTable = ({ stats, className = '' }: FinancingTableProps) => {
  const total = stats.colciencias + stats.univalle + stats.otros;

  const rows = [
    { fuente: 'COLCIENCIAS', cantidad: stats.colciencias },
    { fuente: 'UNIVERSIDAD DEL VALLE', cantidad: stats.univalle },
    { fuente: 'OTROS', cantidad: stats.otros },
  ];

  if (total === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Fuentes de financiación de proyectos</h3>
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Fuentes de financiación de proyectos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Fuente</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.fuente}
                className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{row.fuente}</td>
                <td className="px-4 py-3 text-right text-gray-700">{row.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
