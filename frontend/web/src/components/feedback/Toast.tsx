import classNames from 'classnames';
import { ToastMessage } from '@/contexts/ToastContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const variants: Record<ToastMessage['type'], string> = {
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700',
  error: 'bg-rose-500/10 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-700',
  info: 'bg-primary-500/10 text-primary-700 dark:text-primary-200 border-primary-200 dark:border-primary-700'
};

interface Props {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<Props> = ({ toast, onDismiss }) => (
  <div
    className={classNames(
      'w-80 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur',
      'flex flex-col gap-1',
      variants[toast.type]
    )}
  >
    <div className="flex items-start justify-between">
      <div className="text-sm font-semibold">{toast.title}</div>
      <button onClick={() => onDismiss(toast.id)} className="text-xs text-slate-400 hover:text-slate-600" aria-label="Dismiss">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
    {toast.description && <p className="text-xs text-slate-500 dark:text-slate-300">{toast.description}</p>}
  </div>
);

export default Toast;
