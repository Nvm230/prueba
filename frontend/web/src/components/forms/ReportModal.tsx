import { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import TextField from './TextField';
import SubmitButton from './SubmitButton';
import { ReportType } from '@/services/reportService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ReportType;
  targetId: number;
  targetName?: string;
  onSubmit: (reason: string, details: string) => Promise<void>;
}

const REPORT_REASONS = [
  'Contenido inapropiado',
  'Spam o publicidad no deseada',
  'Acoso o comportamiento abusivo',
  'Información falsa o engañosa',
  'Violación de derechos de autor',
  'Otro'
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  type,
  targetId,
  targetName,
  onSubmit
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !details.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reason, details);
      setReason('');
      setDetails('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'EVENT':
        return 'evento';
      case 'PROFILE':
        return 'perfil';
      case 'GROUP':
        return 'grupo';
      case 'POST':
        return 'publicación';
      default:
        return 'contenido';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card bg-white dark:bg-slate-900 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
              <ExclamationTriangleIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reportar {getTypeLabel()}</h2>
              {targetName && (
                <p className="text-sm text-slate-500 dark:text-slate-400">{targetName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Motivo del reporte
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    reason === r
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Detalles adicionales
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Proporciona más información sobre el problema..."
              rows={5}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
              required
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Los administradores revisarán tu reporte y tomarán las acciones necesarias.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <SubmitButton
              type="submit"
              loading={isSubmitting}
              disabled={!reason || !details.trim()}
              className="flex-1"
            >
              Enviar Reporte
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;



