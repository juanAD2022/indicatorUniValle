import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ProfesorActivo } from '@models/Profesor';
import { createProfesorActivo, updateProfesorActivo } from '@services/profesor';

const CATEGORIAS = [
  { value: 'PLANTA', label: 'Planta' },
  { value: 'CONTRATISTAS', label: 'Contratistas' },
  { value: 'ASISTENTES DE DOCENCIA', label: 'Asistentes de docencia' },
  { value: 'COMISION DE ESTUDIOS', label: 'Comisión de estudios' },
];

const ESTADOS = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
];

interface ProfesorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  profesor: ProfesorActivo | null;
}

export const ProfesorAddModal = ({
  isOpen,
  onClose,
  onSuccess,
  profesor,
}: ProfesorAddModalProps) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cvlac, setCvlac] = useState('');
  const [estado, setEstado] = useState('ACTIVO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!profesor;

  useEffect(() => {
    if (profesor) {
      setNombre(profesor.nombre);
      setCategoria(profesor.categoria);
      setCvlac(profesor.cvlac || '');
      setEstado(profesor.estado);
    } else {
      setNombre('');
      setCategoria('');
      setCvlac('');
      setEstado('ACTIVO');
    }
    setErrors({});
  }, [profesor, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!categoria) newErrors.categoria = 'La categoría es requerida';
    if (!estado) newErrors.estado = 'El estado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = {
        nombre: nombre.trim(),
        categoria,
        cvlac: cvlac.trim() || null,
        estado,
      };

      if (isEditing && profesor) {
        await updateProfesorActivo(profesor.id, data);
      } else {
        await createProfesorActivo(data);
      }
      onSuccess();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
            'Error al guardar el profesor'
          : 'Error al guardar el profesor';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-[#CC1C1C]">
            {isEditing ? 'Editar profesor' : 'Agregar profesor'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre completo del profesor"
              />
              {errors.nombre && (
                <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent ${
                  errors.categoria ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="mt-1 text-xs text-red-600">{errors.categoria}</p>
              )}
            </div>

            {/* CvLAC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CvLAC
              </label>
              <input
                type="text"
                value={cvlac}
                onChange={(e) => setCvlac(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent"
                placeholder="URL del CvLAC (opcional)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Dejar vacío si no tiene CvLAC
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent ${
                  errors.estado ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {ESTADOS.map((est) => (
                  <option key={est.value} value={est.value}>
                    {est.label}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <p className="mt-1 text-xs text-red-600">{errors.estado}</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#CC1C1C] hover:bg-[#a01616] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
