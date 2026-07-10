import type { InvestigatorsTableProps } from './InvestigatorsTable.types';

export const InvestigatorsTable = ({ data, className = '' }: InvestigatorsTableProps) => {
  const totalJunior = data.reduce((sum, r) => sum + r.investigador_junior, 0);
  const totalAsociado = data.reduce((sum, r) => sum + r.investigador_asociado, 0);
  const totalSenior = data.reduce((sum, r) => sum + r.investigador_senior, 0);

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Investigadores por categoría</h3>
        <div className="flex items-center justify-center h-40 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Investigadores por categoría</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Año</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Junior</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Asociado</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Senior</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900">{row.periodo}</td>
                <td className="px-4 py-3 text-gray-700">{row.investigador_junior}</td>
                <td className="px-4 py-3 text-gray-700">{row.investigador_asociado}</td>
                <td className="px-4 py-3 text-gray-700">{row.investigador_senior}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-3 text-gray-900">TOTAL</td>
              <td className="px-4 py-3 text-gray-900">{totalJunior}</td>
              <td className="px-4 py-3 text-gray-900">{totalAsociado}</td>
              <td className="px-4 py-3 text-gray-900">{totalSenior}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
