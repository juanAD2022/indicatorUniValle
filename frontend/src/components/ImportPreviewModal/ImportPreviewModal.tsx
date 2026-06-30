import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import type { ImportPreviewModalProps } from './ImportPreviewModal.types';

export const ImportPreviewModal = ({
  isOpen,
  preview,
  isLoading,
  onConfirm,
  onCancel,
}: ImportPreviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#CC1C1C]">
            {isLoading ? 'Procesando archivo...' : 'Vista previa de importación'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#CC1C1C]" />
              <p className="mt-4 text-gray-600">Analizando archivo Excel...</p>
            </div>
          ) : preview ? (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">{preview.total_rows}</div>
                  <div className="text-xs text-gray-500">Total filas</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{preview.to_create}</div>
                  <div className="text-xs text-gray-500">A crear</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{preview.to_update}</div>
                  <div className="text-xs text-gray-500">A actualizar</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">{preview.unchanged}</div>
                  <div className="text-xs text-gray-500">Sin cambios</div>
                </div>
              </div>

              {/* Errors */}
              {preview.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                    <XCircle className="h-4 w-4" />
                    Errores ({preview.errors.length})
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {preview.errors.map((err, i) => (
                      <div key={i} className="text-sm text-red-600">
                        Fila {err.row}: {err.field} - {err.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Changes */}
              {preview.sample_changes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Muestra de cambios (primeros {preview.sample_changes.length})
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Fila
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Periodo
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Acción
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                            Campos modificados
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.sample_changes.map((change, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-3 py-2 text-gray-700">{change.row}</td>
                            <td className="px-3 py-2 font-medium text-gray-900">
                              {change.periodo}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  change.action === 'create'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {change.action === 'create' ? 'Crear' : 'Actualizar'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-600 text-xs">
                              {change.fields_changed.join(', ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* No changes */}
              {preview.to_create === 0 && preview.to_update === 0 && preview.errors.length === 0 && (
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 rounded-xl p-4">
                  <AlertTriangle className="h-5 w-5" />
                  No hay cambios para aplicar. Todos los registros ya existen con los mismos valores.
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !preview || (preview.errors.length > 0 && preview.to_create === 0 && preview.to_update === 0)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#CC1C1C] hover:bg-[#a01616] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Procesando...'
              : preview
                ? `Confirmar (${preview.to_create} crear, ${preview.to_update} actualizar)`
                : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
