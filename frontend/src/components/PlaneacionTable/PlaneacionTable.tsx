import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import type { PlaneacionCurso } from '@models/GestionDirectiva';

const ITEMS_PER_PAGE = 8;

type SortField = keyof PlaneacionCurso;
type SortDirection = 'asc' | 'desc';

interface PlaneacionTableProps {
  data: PlaneacionCurso[];
  isLoading: boolean;
  selectedPeriod?: string | null;
}

export const PlaneacionTable = ({ data, isLoading, selectedPeriod }: PlaneacionTableProps) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('periodo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredData = useMemo(() => {
    let result = data;
    if (selectedPeriod) result = result.filter((d) => d.periodo === selectedPeriod);
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((d) =>
        d.periodo.toLowerCase().includes(term) ||
        d.curso.toLowerCase().includes(term)
      );
    }
    return result;
  }, [data, selectedPeriod, search]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (aVal === null || bVal === null) return 0;
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-2 py-2 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('periodo')} className="hover:text-[#CC1C1C]">Periodo{sortIcon('periodo')}</button>
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('curso')} className="hover:text-[#CC1C1C]">Curso{sortIcon('curso')}</button>
              </th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">Grupos Est.</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">Cupo Grupo</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-700">Matriculados</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No hay datos.</td></tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors">
                  <td className="px-2 py-2 font-medium text-gray-900">{row.periodo}</td>
                  <td className="px-2 py-2 text-gray-700">{row.curso}</td>
                  <td className="px-2 py-2 text-gray-700">{row.grupos_estimados}</td>
                  <td className="px-2 py-2 text-gray-700">{row.cupo_grupo}</td>
                  <td className="px-2 py-2 text-gray-700">{row.cupos_solicitados}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-3 py-2 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} de {sortedData.length}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-600"><ChevronsLeft className="h-3 w-3" /></button>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-600"><ChevronLeft className="h-3 w-3" /></button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 3 && currentPage > 2) page = Math.min(currentPage - 1 + i, totalPages - 2 + i);
              if (page > totalPages) return null;
              return (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-[#CC1C1C] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>{page}</button>
              );
            })}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-600"><ChevronRight className="h-3 w-3" /></button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-600"><ChevronsRight className="h-3 w-3" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
