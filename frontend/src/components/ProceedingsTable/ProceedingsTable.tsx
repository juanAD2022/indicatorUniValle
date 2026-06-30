import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Upload,
  Download,
  Trash2,
  FileText,
  Calendar,
  Filter,
} from 'lucide-react';
import type { ProceedingsTableProps, SortField, SortDirection } from './ProceedingsTable.types';
import type { Proceeding } from '@models/Proceedings';
import { UploadModal } from './UploadModal';
import type { UploadData } from './UploadModal';
import {
  getProceedings,
  uploadProceeding,
  deleteProceeding,
  getDownloadUrl,
} from '@services/proceedings';

const ITEMS_PER_PAGE = 10;

const DOCUMENT_TYPES = ['ACTA', 'BOLETIN', 'RESOLUCION', 'INFORME', 'CIRCULAR'];
const DOCUMENT_CATEGORIES = ['ACADEMICO', 'ADMINISTRATIVO', 'NORMATIVO'];

export const ProceedingsTable = ({ categoryId }: ProceedingsTableProps) => {
  const [data, setData] = useState<Proceeding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterDocType, setFilterDocType] = useState('');
  const [filterDocCategory, setFilterDocCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('upload_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getProceedings(categoryId, {
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        document_type: filterDocType || undefined,
        document_category: filterDocCategory || undefined,
      });
      setData(result);
    } catch {
      setError('Error al cargar las actas.');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, search, dateFrom, dateTo, filterDocType, filterDocCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const filteredData = useMemo(() => {
    let result = data;

    if (search) {
      const term = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.original_name.toLowerCase().includes(term) ||
          d.document_type.toLowerCase().includes(term) ||
          d.document_category.toLowerCase().includes(term) ||
          (d.observation && d.observation.toLowerCase().includes(term))
      );
    }

    if (dateFrom) {
      result = result.filter((d) => d.upload_date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((d) => d.upload_date <= dateTo + 'T23:59:59');
    }

    if (filterDocType) {
      result = result.filter((d) => d.document_type === filterDocType);
    }
    if (filterDocCategory) {
      result = result.filter((d) => d.document_category === filterDocCategory);
    }

    return result;
  }, [data, search, dateFrom, dateTo, filterDocType, filterDocCategory]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal: string;
      let bVal: string;

      if (sortField === 'observation') {
        aVal = a.observation || '';
        bVal = b.observation || '';
      } else {
        aVal = a[sortField] || '';
        bVal = b[sortField] || '';
      }

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
    setDateFrom('');
    setDateTo('');
    setFilterDocType('');
    setFilterDocCategory('');
    setCurrentPage(1);
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleUpload = async (file: File, data: UploadData) => {
    setIsUploading(true);
    try {
      await uploadProceeding(
        file,
        categoryId,
        data.documentType,
        data.documentCategory,
        data.version,
        data.format,
        data.observation || undefined
      );
      setShowModal(false);
      fetchData();
    } catch {
      alert('Error al subir el archivo. Intente nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number, fileName: string) => {
    if (!window.confirm(`¿Está seguro de eliminar "${fileName}"?`)) return;

    try {
      await deleteProceeding(id);
      fetchData();
    } catch {
      alert('Error al eliminar el archivo.');
    }
  };

  const handleDownload = (id: number) => {
    const url = getDownloadUrl(id);
    window.open(url, '_blank');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getDocTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      ACTA: 'bg-blue-100 text-blue-800',
      BOLETIN: 'bg-green-100 text-green-800',
      RESOLUCION: 'bg-purple-100 text-purple-800',
      INFORME: 'bg-orange-100 text-orange-800',
      CIRCULAR: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDocCategoryBadge = (cat: string) => {
    const colors: Record<string, string> = {
      ACADEMICO: 'bg-indigo-100 text-indigo-800',
      ADMINISTRATIVO: 'bg-amber-100 text-amber-800',
      NORMATIVO: 'bg-teal-100 text-teal-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando actas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      <UploadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#CC1C1C]" />
            Documentos
          </h3>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4" />
            Subir documento
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search by name */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            />
          </div>

          {/* Document Type Filter */}
          <select
            value={filterDocType}
            onChange={(e) => {
              setFilterDocType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
          >
            <option value="">Tipo documento</option>
            {DOCUMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Document Category Filter */}
          <select
            value={filterDocCategory}
            onChange={(e) => {
              setFilterDocCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
          >
            <option value="">Categoría</option>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            />
          </div>

          {/* Clear filters */}
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[#CC1C1C] hover:bg-[#FFF0F0] rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('original_name')} className="hover:text-[#CC1C1C]">
                  Documento{sortIcon('original_name')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('document_type')} className="hover:text-[#CC1C1C]">
                  Tipo{sortIcon('document_type')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('document_category')} className="hover:text-[#CC1C1C]">
                  Categoría{sortIcon('document_category')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('upload_date')} className="hover:text-[#CC1C1C]">
                  Fecha{sortIcon('upload_date')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('version')} className="hover:text-[#CC1C1C]">
                  Versión{sortIcon('version')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('format')} className="hover:text-[#CC1C1C]">
                  Formato{sortIcon('format')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('observation')} className="hover:text-[#CC1C1C]">
                  Observaciones{sortIcon('observation')}
                </button>
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700 w-24">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No se encontraron documentos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedData.map((row: Proceeding) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                    {row.original_name}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDocTypeBadge(row.document_type)}`}
                    >
                      {row.document_type}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDocCategoryBadge(row.document_category)}`}
                    >
                      {row.document_category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(row.upload_date)}
                  </td>
                  <td className="px-3 py-3 text-gray-700">{row.version}</td>
                  <td className="px-3 py-3 text-gray-700">{row.format}</td>
                  <td className="px-3 py-3 text-gray-700 max-w-[150px] truncate">
                    {row.observation || '-'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleDownload(row.id)}
                        className="p-1.5 text-[#1565C0] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.original_name)}
                        className="p-1.5 text-[#CC1C1C] hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
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
