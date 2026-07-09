import { useState, useEffect } from 'react';
import { X, Bell, Plus, Save } from 'lucide-react';
import type { Alert } from '@models/Alert';

const ALERT_TYPES = ['REPORTE', 'ALERTA'];

interface AlertFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AlertFormData) => Promise<void>;
  isSaving: boolean;
  alertToEdit?: Alert | null;
}

export interface AlertFormData {
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export const AlertFormModal = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  alertToEdit,
}: AlertFormModalProps) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState(ALERT_TYPES[0]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const isEditing = !!alertToEdit;

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setTipo(ALERT_TYPES[0]);
    setFechaInicio('');
    setFechaFin('');
  };

  useEffect(() => {
    if (alertToEdit) {
      setNombre(alertToEdit.nombre);
      setDescripcion(alertToEdit.descripcion || '');
      setTipo(alertToEdit.tipo);
      setFechaInicio(alertToEdit.fecha_inicio.split('T')[0]);
      setFechaFin(alertToEdit.fecha_fin ? alertToEdit.fecha_fin.split('T')[0] : '');
    } else {
      resetForm();
    }
  }, [alertToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!nombre.trim() || !fechaInicio) return;
    await onSave({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || '',
    });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#CC1C1C]" />
            {isEditing ? 'Editar alerta' : 'Nueva alerta'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la alerta o reporte"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripcion
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Descripcion opcional"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={inputClass}
            >
              {ALERT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio *
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!nombre.trim() || !fechaInicio || isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};
