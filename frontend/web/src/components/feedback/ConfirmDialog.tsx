import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading = false
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const variantStyles = {
    danger: 'bg-error-500 hover:bg-error-600',
    warning: 'bg-warning-500 hover:bg-warning-600',
    info: 'bg-primary-500 hover:bg-primary-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="card max-w-md w-full relative z-10 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-2 rounded-full ${variant === 'danger' ? 'bg-error-100 dark:bg-error-900/30' : variant === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
            <ExclamationTriangleIcon
              className={`h-6 w-6 ${variant === 'danger' ? 'text-error-600 dark:text-error-400' : variant === 'warning' ? 'text-warning-600 dark:text-warning-400' : 'text-primary-600 dark:text-primary-400'}`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
              >
                {loading ? 'Procesando...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

