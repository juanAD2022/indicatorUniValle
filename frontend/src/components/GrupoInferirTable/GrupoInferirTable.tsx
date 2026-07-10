import { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Upload,
} from 'lucide-react';
import type { GrupoInferirTableProps, SortField, SortDirection } from './GrupoInferirTable.types';
import type { GrupoInferirIndicator } from '@models/GrupoInferirIndicator';
import { uploadPreview, confirmImport } from '@services/studentIndicator/importService';
import type { ImportPreview } from '@services/studentIndicator/importService';
import { ImportPreviewModal } from '@components/ImportPreviewModal';

const ITEMS_PER_PAGE = 10;

export const GrupoInferirTable = ({
  data,
  isLoading,
  onImportComplete,
  selectedPeriod,
}: GrupoInferirTableProps) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('periodo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setImportSuccess(null);

    try {
      const preview = await uploadPreview(file, 'GRUPO_INFERIR');
      setImportPreview(preview);
      setShowModal(true);
    } catch {
      alert('Error al procesar el archivo. Verifique que el formato sea correcto.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    try {
      const result = await confirmImport(importPreview.pending_rows, 'GRUPO_INFERIR');
      setShowModal(false);
      setImportPreview(null);
      setImportSuccess(result.message);
      onImportComplete?.();
    } catch {
      alert('Error al ejecutar la importación.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setShowModal(false);
    setImportPreview(null);
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <ImportPreviewModal
        isOpen={showModal}
        preview={importPreview}
        isLoading={isImporting}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
      />

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
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

          <button
            onClick={handleImportClick}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Subiendo...' : 'Importar Excel'}
          </button>

          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-[#CC1C1C] hover:bg-[#FFF0F0] rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="px-4 py-3 bg-green-50 border-b border-green-200 text-green-700 text-sm">
          {importSuccess}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('periodo')} className="hover:text-[#CC1C1C]">
                  Periodo{sortIcon('periodo')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('profesores_vinculados')} className="hover:text-[#CC1C1C]">
                  Prof.{sortIcon('profesores_vinculados')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('jovenes_investigadores')} className="hover:text-[#CC1C1C]">
                  Jóv. Inv.{sortIcon('jovenes_investigadores')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('monitores')} className="hover:text-[#CC1C1C]">
                  Monit.{sortIcon('monitores')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('proyectos_desarrollo')} className="hover:text-[#CC1C1C]">
                  Proy. Desarr.{sortIcon('proyectos_desarrollo')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('proyectos_finalizados')} className="hover:text-[#CC1C1C]">
                  Proy. Final.{sortIcon('proyectos_finalizados')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('ponencias_nacionales')} className="hover:text-[#CC1C1C]">
                  Pon. Nac.{sortIcon('ponencias_nacionales')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('ponencias_internacionales')} className="hover:text-[#CC1C1C]">
                  Pon. Int.{sortIcon('ponencias_internacionales')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('revistas_nacionales')} className="hover:text-[#CC1C1C]">
                  Rev. Nac.{sortIcon('revistas_nacionales')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('revistas_internacionales')} className="hover:text-[#CC1C1C]">
                  Rev. Int.{sortIcon('revistas_internacionales')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('publicaciones_eventos')} className="hover:text-[#CC1C1C]">
                  Pub. Eventos{sortIcon('publicaciones_eventos')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                  No se encontraron registros con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedData.map((row: GrupoInferirIndicator) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-gray-900">{row.periodo}</td>
                  <td className="px-3 py-3 text-gray-700">{row.profesores_vinculados}</td>
                  <td className="px-3 py-3 text-gray-700">{row.jovenes_investigadores}</td>
                  <td className="px-3 py-3 text-gray-700">{row.monitores}</td>
                  <td className="px-3 py-3 text-gray-700">{row.proyectos_desarrollo}</td>
                  <td className="px-3 py-3 text-gray-700">{row.proyectos_finalizados}</td>
                  <td className="px-3 py-3 text-gray-700">{row.ponencias_nacionales}</td>
                  <td className="px-3 py-3 text-gray-700">{row.ponencias_internacionales}</td>
                  <td className="px-3 py-3 text-gray-700">{row.revistas_nacionales}</td>
                  <td className="px-3 py-3 text-gray-700">{row.revistas_internacionales}</td>
                  <td className="px-3 py-3 text-gray-700">{row.publicaciones_eventos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
