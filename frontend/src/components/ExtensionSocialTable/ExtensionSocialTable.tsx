import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExtensionSocial } from '@models/ExtensionSocial';

interface ExtensionSocialTableProps {
  data: ExtensionSocial[];
  isLoading: boolean;
  selectedPeriod: string | null;
}

export const ExtensionSocialTable = ({ data, isLoading, selectedPeriod }: ExtensionSocialTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center h-32 text-gray-500">
          Cargando datos...
        </div>
      </div>
    );
  }

  const displayData = selectedPeriod
    ? data.filter((d) => d.periodo === selectedPeriod)
    : data;

  if (!displayData.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center h-32 text-gray-500">
          No hay datos disponibles.
        </div>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, displayData.length);
  const paginatedData = displayData.slice(startIndex, endIndex);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#CC1C1C] uppercase tracking-wide">
          Datos de extensión social
        </h3>
        <span className="text-xs text-gray-500">
          {displayData.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Período</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Conf.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Cursos</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Dipl.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Talleres</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Cons.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Asist.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Horas</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">P.Est.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">P.Egr.</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">P.Prof.</th>
              <th className="px-3 py-2 text-right font-medium text-gray-600">Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50">
                <td className="px-3 py-2 font-medium text-gray-900">{row.periodo}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.conferencias_dictadas}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.cursos_ofrecidos}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.diplomados_ofrecidos}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.talleres_ofrecidos}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.consultorias}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.asistentes}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.horas_ofrecidas}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.participacion_estudiantil}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.participacion_egresados}</td>
                <td className="px-3 py-2 text-center text-gray-600">{row.participacion_profesores}</td>
                <td className="px-3 py-2 text-right text-gray-600 font-medium">
                  {formatCurrency(row.ingreso_neto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrando</span>
            <span className="font-medium">{startIndex + 1}</span>
            <span>a</span>
            <span className="font-medium">{endIndex}</span>
            <span>de</span>
            <span className="font-medium">{displayData.length}</span>
            <span>registros</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#CC1C1C]/30 focus:border-[#CC1C1C]"
            >
              <option value={5}>5 / página</option>
              <option value={10}>10 / página</option>
              <option value={20}>20 / página</option>
              <option value={50}>50 / página</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-[#CC1C1C] text-white'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
