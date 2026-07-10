import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import type { StudentIndicatorTableProps, SortField, SortDirection } from './StudentIndicatorTable.types';
import type { CohortSummary } from '@models/StudentIndicator';

const ITEMS_PER_PAGE = 11;

export const StudentIndicatorTable = ({
  data,
  isLoading,
  selectedPeriod,
}: StudentIndicatorTableProps) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('periodo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredData = useMemo(() => {
    let result = data;

    if (selectedPeriod) result = result.filter((d) => d.periodo === selectedPeriod);

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((d) => d.periodo.toLowerCase().includes(term));
    }

    return result;
  }, [data, selectedPeriod, search]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCurrentPage(1);
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando indicadores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por periodo..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            />
          </div>

          {/* Clear filters */}
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-[#CC1C1C] hover:bg-[#FFF0F0] rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('periodo')} className="hover:text-[#CC1C1C]">
                  Periodo{sortIcon('periodo')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('matriculados')} className="hover:text-[#CC1C1C]">
                  Matriculados{sortIcon('matriculados')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('graduados')} className="hover:text-[#CC1C1C]">
                  Graduados{sortIcon('graduados')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('desertores')} className="hover:text-[#CC1C1C]">
                  Desertores{sortIcon('desertores')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('retirados_bra')} className="hover:text-[#CC1C1C]">
                  Retirados por BRA{sortIcon('retirados_bra')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('tesis_en_desarrollo')} className="hover:text-[#CC1C1C]">
                  Trabajos de grado en desarrollo{sortIcon('tesis_en_desarrollo')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('tesis_finalizados')} className="hover:text-[#CC1C1C]">
                  Trabajos de grado finalizados{sortIcon('tesis_finalizados')}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <button onClick={() => handleSort('practicas_profesionales')} className="hover:text-[#CC1C1C]">
                  Prácticas profesionales{sortIcon('practicas_profesionales')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No se encontraron registros con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedData.map((row: CohortSummary) => (
                <tr
                  key={row.periodo}
                  className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{row.periodo}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.matriculados}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.graduados}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.desertores}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.retirados_bra}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.tesis_en_desarrollo}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.tesis_finalizados}</td>
                  <td className="px-4 py-3 text-center font-medium text-[#1565C0]">{row.practicas_profesionales}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} de {sortedData.length}{' '}
            registros
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
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${currentPage === page
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
