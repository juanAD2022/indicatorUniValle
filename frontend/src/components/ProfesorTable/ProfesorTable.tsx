import { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import type { ProfesorActivo } from '@models/Profesor';
import { deleteProfesorActivo } from '@services/profesor';
import { ProfesorAddModal } from '@components/ProfesorAddModal';

const ITEMS_PER_PAGE = 10;

const CATEGORIAS = [
  'PLANTA',
  'CONTRATISTAS',
  'ASISTENTES DE DOCENCIA',
  'COMISION DE ESTUDIOS',
];

const CVLAC_OPTIONS = ['Con CvLAC', 'Sin CvLAC'];

interface ProfesorTableProps {
  data: ProfesorActivo[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ProfesorTable = ({ data, isLoading, onRefresh }: ProfesorTableProps) => {
  const [search, setSearch] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterCvlac, setFilterCvlac] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<ProfesorActivo | null>(null);
  const [viewingProfesor, setViewingProfesor] = useState<ProfesorActivo | null>(null);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((d) => d.nombre.toLowerCase().includes(term));
    }

    if (filterCategoria) {
      result = result.filter((d) => d.categoria === filterCategoria);
    }

    if (filterCvlac === 'Con CvLAC') {
      result = result.filter((d) => d.cvlac && d.cvlac.trim() !== '');
    } else if (filterCvlac === 'Sin CvLAC') {
      result = result.filter((d) => !d.cvlac || d.cvlac.trim() === '');
    }

    return result;
  }, [data, search, filterCategoria, filterCvlac]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = () => {
    setEditingProfesor(null);
    setShowModal(true);
  };

  const handleEdit = (profesor: ProfesorActivo) => {
    setEditingProfesor(profesor);
    setShowModal(true);
  };

  const handleView = (profesor: ProfesorActivo) => {
    setViewingProfesor(profesor);
  };

  const handleDelete = useCallback(
    async (profesor: ProfesorActivo) => {
      if (!window.confirm(`¿Está seguro de eliminar a "${profesor.nombre}"?`)) return;
      try {
        await deleteProfesorActivo(profesor.id);
        onRefresh();
      } catch {
        alert('Error al eliminar el profesor.');
      }
    },
    [onRefresh]
  );

  const handleModalClose = () => {
    setShowModal(false);
    setEditingProfesor(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingProfesor(null);
    onRefresh();
  };

  const getCategoriaBadge = (cat: string) => {
    const colors: Record<string, string> = {
      PLANTA: 'bg-red-100 text-red-800',
      CONTRATISTAS: 'bg-blue-100 text-blue-800',
      'ASISTENTES DE DOCENCIA': 'bg-green-100 text-green-800',
      'COMISION DE ESTUDIOS': 'bg-amber-100 text-amber-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'ACTIVO') return 'bg-green-100 text-green-700';
    if (estado === 'INACTIVO') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-32 text-gray-500">Cargando profesores...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Listado de profesores</h3>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar profesor
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar profesor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
              />
            </div>

            <select
              value={filterCategoria}
              onChange={(e) => {
                setFilterCategoria(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterCvlac}
              onChange={(e) => {
                setFilterCvlac(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
            >
              <option value="">Todos los CvLAC</option>
              {CVLAC_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-semibold text-gray-700 w-12">#</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Nombre del profesor</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Categoría</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">CvLAC</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700">Estado</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No se encontraron profesores con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
                  >
                    <td className="px-3 py-3 text-gray-600">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">{row.nombre}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoriaBadge(row.categoria)}`}
                      >
                        {row.categoria}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {row.cvlac ? (
                        <a
                          href={row.cvlac}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1565C0] hover:underline text-xs"
                        >
                          Ver CvLAC
                        </a>
                      ) : (
                        <span className="text-red-500 text-xs">Sin CvLAC</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(row.estado)}`}
                      >
                        {row.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleView(row)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(row)}
                          className="p-1.5 text-[#1565C0] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
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
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} de {filteredData.length} registros
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

      {/* Add/Edit Modal */}
      <ProfesorAddModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        profesor={editingProfesor}
      />

      {/* View Modal */}
      {viewingProfesor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewingProfesor(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">Detalle del profesor</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase">Nombre</span>
                <p className="text-sm font-medium text-gray-900">{viewingProfesor.nombre}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">Categoría</span>
                <p className="text-sm font-medium text-gray-900">{viewingProfesor.categoria}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">CvLAC</span>
                <p className="text-sm">
                  {viewingProfesor.cvlac ? (
                    <a href={viewingProfesor.cvlac} target="_blank" rel="noopener noreferrer" className="text-[#1565C0] hover:underline">
                      {viewingProfesor.cvlac}
                    </a>
                  ) : (
                    <span className="text-red-500">Sin CvLAC</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase">Estado</span>
                <p className="text-sm font-medium text-gray-900">{viewingProfesor.estado}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingProfesor(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
