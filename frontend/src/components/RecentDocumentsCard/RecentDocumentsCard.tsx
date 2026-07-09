import { useEffect, useState, useCallback } from 'react';
import { FileText, File } from 'lucide-react';
import { getAllProceedings } from '@services/proceedings';
import type { Proceeding } from '@models/Proceedings';
import type { RecentDocumentsCardProps } from './RecentDocumentsCard.types';

const DOC_TYPE_BADGES: Record<string, string> = {
  ACTA: 'bg-blue-100 text-blue-800',
  RESOLUCION: 'bg-purple-100 text-purple-800',
  INFORME: 'bg-orange-100 text-orange-800',
  CIRCULAR: 'bg-gray-100 text-gray-800',
  BOLETIN: 'bg-green-100 text-green-800',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  ACTA: 'Acta',
  RESOLUCION: 'Resolución',
  INFORME: 'Informe',
  CIRCULAR: 'Circular',
  BOLETIN: 'Boletín',
};

const getFileIcon = (format: string) => {
  switch (format?.toUpperCase()) {
    case 'PDF':
      return <FileText className="h-5 w-5 text-red-500 shrink-0" />;
    case 'WORD':
    case 'DOC':
    case 'DOCX':
      return <FileText className="h-5 w-5 text-blue-500 shrink-0" />;
    case 'EXCEL':
    case 'XLS':
    case 'XLSX':
      return <FileText className="h-5 w-5 text-green-600 shrink-0" />;
    default:
      return <File className="h-5 w-5 text-gray-500 shrink-0" />;
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

export const RecentDocumentsCard = ({ className = '' }: RecentDocumentsCardProps) => {
  const [documents, setDocuments] = useState<Proceeding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getAllProceedings();
      setDocuments(result.slice(0, 5));
    } catch {
      // Silenciar error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-bold text-[#CC1C1C] mb-4">
        Últimos documentos cargados
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
          Cargando documentos...
        </div>
      ) : documents.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
          No hay documentos cargados.
        </div>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              {getFileIcon(doc.format)}
              <span className="flex-1 text-sm text-gray-800 truncate min-w-0">
                {doc.original_name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  DOC_TYPE_BADGES[doc.document_type] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {DOC_TYPE_LABELS[doc.document_type] || doc.document_type}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                {formatDate(doc.upload_date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
