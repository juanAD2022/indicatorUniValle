import { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const DOCUMENT_TYPES = ['ACTA', 'BOLETIN', 'RESOLUCION', 'INFORME', 'CIRCULAR'];
const DOCUMENT_CATEGORIES = ['ACADEMICO', 'ADMINISTRATIVO', 'NORMATIVO'];
const VERSIONS = ['V1', 'V2', 'V3', 'V4', 'V5'];
const FORMATS = ['PDF', 'WORD'];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, data: UploadData) => Promise<void>;
  isUploading: boolean;
}

export interface UploadData {
  documentType: string;
  documentCategory: string;
  version: string;
  format: string;
  observation: string;
}

export const UploadModal = ({ isOpen, onClose, onUpload, isUploading }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [documentCategory, setDocumentCategory] = useState(DOCUMENT_CATEGORIES[0]);
  const [version, setVersion] = useState(VERSIONS[0]);
  const [format, setFormats] = useState(FORMATS[0]);
  const [observation, setObservation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFormats('PDF');
      else if (ext === 'doc' || ext === 'docx') setFormats('WORD');
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    await onUpload(file, {
      documentType,
      documentCategory,
      version,
      format,
      observation,
    });
    resetForm();
  };

  const resetForm = () => {
    setFile(null);
    setDocumentType(DOCUMENT_TYPES[0]);
    setDocumentCategory(DOCUMENT_CATEGORIES[0]);
    setVersion(VERSIONS[0]);
    setFormats(FORMATS[0]);
    setObservation('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#CC1C1C] focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#CC1C1C]" />
            Subir documento
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivo *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className={inputClass}
            />
            {file && (
              <p className="mt-1 text-sm text-gray-500 truncate">{file.name}</p>
            )}
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de documento *
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={inputClass}
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Document Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <select
              value={documentCategory}
              onChange={(e) => setDocumentCategory(e.target.value)}
              className={inputClass}
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Version and Format */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Versión *
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className={inputClass}
              >
                {VERSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato *
              </label>
              <select
                value={format}
                onChange={(e) => setFormats(e.target.value)}
                className={inputClass}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Observation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              rows={3}
              placeholder="Comentarios adicionales (opcional)"
              className={inputClass}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1565C0] hover:bg-[#0d47a1] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            {isUploading ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
};
