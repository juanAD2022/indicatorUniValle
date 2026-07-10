import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import type { InvestigatorsTableProps } from './InvestigatorsTable.types';

const ITEMS_PER_PAGE = 6;

export const InvestigatorsTable = ({ data, className = '' }: InvestigatorsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalJunior = data.reduce((sum, r) => sum + r.investigador_junior, 0);
  const totalAsociado = data.reduce((sum, r) => sum + r.investigador_asociado, 0);
  const totalSenior = data.reduce((sum, r) => sum + r.investigador_senior, 0);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            {paginatedData.map((row) => (
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

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#CC1C1C] text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
