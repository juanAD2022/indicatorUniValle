import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Plus,
  Trash2,
  Bell,
  Calendar,
  Filter,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { SortField, SortDirection } from './AlertsTable.types';
import type { Alert } from '@models/Alert';
import { AlertFormModal, type AlertFormData } from './AlertFormModal';
import {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from '@services/alerts';

const ITEMS_PER_PAGE = 10;

const ALERT_TYPES = ['REPORTE', 'ALERTA'];
const ALERT_STATUSES = ['PENDIENTE', 'FINALIZADO'];

export const AlertsTable = () => {
  const [data, setData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAlerts({
        search: search || undefined,
        tipo: filterTipo || undefined,
        estado: filterEstado || undefined,
      });
      setData(result);
    } catch {
      setError('Error al cargar las alertas.');
    } finally {
      setIsLoading(false);
    }
  }, [search, filterTipo, filterEstado]);

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
          d.nombre.toLowerCase().includes(term) ||
          (d.descripcion && d.descripcion.toLowerCase().includes(term))
      );
    }

    if (filterTipo) {
      result = result.filter((d) => d.tipo === filterTipo);
    }
    if (filterEstado) {
      result = result.filter((d) => d.estado === filterEstado);
    }

    return result;
  }, [data, search, filterTipo, filterEstado]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
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
    setFilterTipo('');
    setFilterEstado('');
    setCurrentPage(1);
  };

  const sortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleCreate = () => {
    setEditingAlert(null);
    setShowModal(true);
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setShowModal(true);
  };

  const handleSave = async (formData: AlertFormData) => {
    setIsSaving(true);
    try {
      if (editingAlert) {
        await updateAlert(editingAlert.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion || undefined,
          tipo: formData.tipo,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin || undefined,
        });
      } else {
        await createAlert({
          nombre: formData.nombre,
          descripcion: formData.descripcion || undefined,
          tipo: formData.tipo,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin || undefined,
        });
      }
      setShowModal(false);
      setEditingAlert(null);
      fetchData();
    } catch {
      alert('Error al guardar la alerta. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (alert: Alert) => {
    const newStatus = alert.estado === 'PENDIENTE' ? 'FINALIZADO' : 'PENDIENTE';
    try {
      await updateAlert(alert.id, { estado: newStatus });
      fetchData();
    } catch {
      console.error('Error al actualizar el estado de la alerta.');
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Esta seguro de eliminar "${nombre}"?`)) return;
    try {
      await deleteAlert(id);
      fetchData();
    } catch {
      alert('Error al eliminar la alerta.');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'REPORTE'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-red-100 text-red-800';
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'PENDIENTE'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-green-100 text-green-800';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Cargando alertas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <AlertFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAlert(null);
        }}
        onSave={handleSave}
        isSaving={isSaving}
        alertToEdit={editingAlert}
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#CC1C1C]" />
            Alertas y Reportes
          </h3>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nueva alerta
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
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

          <select
            value={filterTipo}
            onChange={(e) => {
              setFilterTipo(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
          >
            <option value="">Tipo</option>
            {ALERT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={filterEstado}
            onChange={(e) => {
              setFilterEstado(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
          >
            <option value="">Estado</option>
            {ALERT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

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
                <button onClick={() => handleSort('nombre')} className="hover:text-[#CC1C1C]">
                  Nombre{sortIcon('nombre')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('tipo')} className="hover:text-[#CC1C1C]">
                  Tipo{sortIcon('tipo')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('estado')} className="hover:text-[#CC1C1C]">
                  Estado{sortIcon('estado')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('fecha_inicio')} className="hover:text-[#CC1C1C]">
                  Fecha Inicio{sortIcon('fecha_inicio')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('fecha_fin')} className="hover:text-[#CC1C1C]">
                  Fecha Fin{sortIcon('fecha_fin')}
                </button>
              </th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">
                Descripcion
              </th>
              <th className="px-3 py-3 text-center font-semibold text-gray-700 w-28">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  No se encontraron alertas con los filtros aplicados.
                </td>
              </tr>
            ) : (
              paginatedData.map((row: Alert) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-[#FFF0F0] transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                    {row.nombre}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTipoBadge(row.tipo)}`}
                    >
                      {row.tipo}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(row.estado)}`}
                    >
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(row.fecha_inicio)}
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                    {row.fecha_fin ? formatDate(row.fecha_fin) : '-'}
                  </td>
                  <td className="px-3 py-3 text-gray-700 max-w-[150px] truncate">
                    {row.descripcion || '-'}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(row)}
                        className="p-1.5 text-[#1565C0] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(row)}
                        className={`p-1.5 rounded-lg transition-colors ${row.estado === 'PENDIENTE'
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-green-600 hover:bg-green-50'
                          }`}
                        title={row.estado === 'PENDIENTE' ? 'Marcar finalizado' : 'Marcar pendiente'}
                      >
                        {row.estado === 'PENDIENTE' ? (
                          <ToggleLeft className="h-4 w-4" />
                        ) : (
                          <ToggleRight className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.nombre)}
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
