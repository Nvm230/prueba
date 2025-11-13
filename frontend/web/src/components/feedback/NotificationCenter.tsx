import Toast from './Toast';
import { ToastMessage } from '@/contexts/ToastContext';
import { useToast } from '@/contexts/ToastContext';

const NotificationCenter: React.FC<{ toasts?: ToastMessage[] }> = ({ toasts }) => {
  const { dismissToast } = useToast();
  const stack = toasts ?? [];
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      {stack.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default NotificationCenter;
