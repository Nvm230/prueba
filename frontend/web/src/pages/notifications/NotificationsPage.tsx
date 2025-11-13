import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import { useAuth } from '@/hooks/useAuth';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { fetchNotifications, sendNotification } from '@/services/notificationService';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useForm } from 'react-hook-form';
import { useToast } from '@/contexts/ToastContext';
import { timeAgo } from '@/utils/formatters';

const NotificationsPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const { register, handleSubmit, reset, formState } = useForm<{ title: string; message: string }>();

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);

  const query = usePaginatedQuery({
    queryKey: ['notifications', user?.id, { page, size }],
    queryFn: (signal) => fetchNotifications(user!.id, { page, size }, signal),
    enabled: Boolean(user)
  });

  const updateParam = (key: string, value: number) => {
    const next = new URLSearchParams(params);
    next.set(key, String(value));
    setParams(next, { replace: true });
  };

  const onSubmit = async (values: { title: string; message: string }) => {
    if (!user) return;
    try {
      await sendNotification(user.id, values);
      pushToast({ type: 'success', title: 'Notificación enviada', description: 'Se envió a tu bandeja personal.' });
      reset();
      query.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error al enviar', description: error.message });
    }
  };

  const notifications = query.data?.content ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Notificaciones' }]} />
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-6 shadow-soft">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Tus notificaciones</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sigue tus alertas importantes y envía recordatorios personalizados.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3" noValidate>
          <TextField label="Título" error={formState.errors.title?.message} {...register('title', { required: 'Requerido' })} />
          <TextField
            label="Mensaje"
            error={formState.errors.message?.message}
            {...register('message', { required: 'Requerido' })}
          />
          <div className="flex items-end">
            <SubmitButton className="w-full">Enviar recordatorio</SubmitButton>
          </div>
        </form>
        {query.isLoading ? (
          <LoadingOverlay message="Cargando notificaciones" />
        ) : notifications.length === 0 ? (
          <EmptyState title="Sin notificaciones" description="Cuando recibas mensajes aparecerán en este listado." />
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-4 py-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                  </div>
                  <span className="text-xs text-slate-400">{timeAgo(notification.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {query.data && query.data.totalPages > 1 && (
          <PaginationControls
            page={query.data.page}
            size={query.data.size}
            totalPages={query.data.totalPages}
            totalElements={query.data.totalElements}
            onPageChange={(nextPage) => updateParam('page', nextPage)}
            onSizeChange={(nextSize) => updateParam('size', nextSize)}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
