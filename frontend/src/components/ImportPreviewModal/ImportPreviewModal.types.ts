import type { ImportPreview } from '@services/studentIndicator/importService';

export interface ImportPreviewModalProps {
  isOpen: boolean;
  preview: ImportPreview | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
