import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import { useAuth } from '@/hooks/useAuth';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, sendNotification } from '@/services/notificationService';
import { fetchUsers } from '@/services/userService';
import { notificationWebSocketService } from '@/services/notificationWebSocketService';
import TextField from '@/components/forms/TextField';
import SelectField from '@/components/forms/SelectField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useForm } from 'react-hook-form';
import { useToast } from '@/contexts/ToastContext';
import { timeAgo } from '@/utils/formatters';
import { BellAlertIcon, PaperAirplaneIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Notification } from '@/types';

const NotificationsPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);

  const query = usePaginatedQuery({
    queryKey: ['notifications', user?.id, { page, size }],
    queryFn: (signal) => fetchNotifications(user!.id, { page, size }, signal),
    enabled: Boolean(user)
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', { page: 0, size: 100 }],
    queryFn: ({ signal }) => fetchUsers({ page: 0, size: 100 }, signal),
    enabled: Boolean(user && (user.role === 'ADMIN' || user.role === 'SERVER'))
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    let disconnect: (() => void) | null = null;

    try {
      disconnect = notificationWebSocketService.connect(user.id, (notification: Notification) => {
        pushToast({
          type: 'info',
          title: notification.title,
          description: notification.message
        });
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      });
    } catch (error) {
      console.error('[Notifications] Error connecting to WebSocket:', error);
    }

    return () => {
      if (disconnect) {
        try {
          disconnect();
        } catch (error) {
          console.error('[Notifications] Error disconnecting WebSocket:', error);
        }
      }
    };
  }, [user?.id, pushToast, queryClient]);

  const updateParam = (key: string, value: number) => {
    const next = new URLSearchParams(params);
    next.set(key, String(value));
    setParams(next, { replace: true });
  };

  const { register, handleSubmit, reset, formState, watch } = useForm<{ title: string; message: string; sendEmail: boolean }>({
    defaultValues: {
      title: '',
      message: '',
      sendEmail: false
    }
  });

  const sendEmailEnabled = watch('sendEmail');

  const canSendNotifications = user && (user.role === 'ADMIN' || user.role === 'SERVER');
  const targetUserId = selectedUserId || user?.id;

  const onSubmit = async (values: { title: string; message: string; sendEmail: boolean }) => {
    if (!targetUserId) return;
    try {
      await sendNotification(targetUserId, {
        title: values.title,
        message: values.message,
        sendEmail: values.sendEmail
      });
      pushToast({
        type: 'success',
        title: 'Notificación enviada',
        description: canSendNotifications && selectedUserId
          ? `La notificación fue enviada al usuario seleccionado.${values.sendEmail ? ' También se envió por correo electrónico.' : ''}`
          : `Se envió a tu bandeja personal.${values.sendEmail ? ' También se envió por correo electrónico.' : ''}`
      });
      reset();
      query.refetch();
    } catch (error: any) {
      pushToast({
        type: 'error',
        title: 'Error al enviar',
        description: error.response?.data?.message || error.message || 'No se pudo enviar la notificación'
      });
    }
  };

  const notifications = query.data?.content ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Notificaciones' }]} />
      
      {/* Información sobre notificaciones */}
      <div className="card bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 border-primary-400 dark:border-primary-700">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">¿Cómo funcionan las notificaciones?</h3>
            <p className="text-xs text-white leading-relaxed">
              {canSendNotifications ? (
                <>
                  Como <strong className="font-bold">{user?.role}</strong>, puedes enviar notificaciones a cualquier usuario del sistema. 
                  Las notificaciones se envían en tiempo real y aparecen inmediatamente en la bandeja del destinatario. 
                  También recibes notificaciones automáticas cuando te registras a eventos.
                </>
              ) : (
                <>
                  Recibirás notificaciones automáticas cuando te registres a eventos. 
                  Los administradores también pueden enviarte notificaciones importantes sobre eventos o actualizaciones del sistema.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario para enviar notificaciones (solo ADMIN/SERVER) */}
      {canSendNotifications && (
        <div className="card border-primary-200 dark:border-primary-800 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <PaperAirplaneIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Enviar Notificación</h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {usersData && usersData.content.length > 0 && (
              <SelectField
                label="Enviar a"
                value={selectedUserId?.toString() || user?.id?.toString() || ''}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value={user?.id?.toString()}>Mí mismo (prueba)</option>
                {usersData.content
                  .filter((u) => u.id !== user?.id)
                  .map((u) => (
                    <option key={u.id} value={u.id.toString()}>
                      {u.name} ({u.email}) - {u.role}
                    </option>
                  ))}
              </SelectField>
            )}
            
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Título"
                placeholder="Ej: Recordatorio de evento"
                error={formState.errors.title?.message}
                {...register('title', { required: 'El título es requerido' })}
                required
              />
              <TextField
                label="Mensaje"
                placeholder="Ej: Tu evento comienza en 1 hora"
                error={formState.errors.message?.message}
                {...register('message', { required: 'El mensaje es requerido' })}
                required
              />
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="sendEmail"
                {...register('sendEmail')}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <label htmlFor="sendEmail" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Enviar también por correo electrónico
              </label>
              {sendEmailEnabled && (
                <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Se enviará un correo
                </span>
              )}
            </div>
            
            <SubmitButton className="w-full sm:w-auto">
              <PaperAirplaneIcon className="h-4 w-4 inline mr-2" />
              Enviar Notificación
            </SubmitButton>
          </form>
        </div>
      )}

      {/* Lista de notificaciones */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <BellAlertIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tus Notificaciones</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {notifications.length > 0
                ? `${notifications.length} notificación${notifications.length !== 1 ? 'es' : ''}`
                : 'No tienes notificaciones aún'}
            </p>
          </div>
        </div>

        {query.isLoading ? (
          <LoadingOverlay message="Cargando notificaciones" />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="Sin notificaciones"
            description={
              canSendNotifications
                ? 'Envía una notificación de prueba o espera a que los usuarios se registren a eventos.'
                : 'Cuando recibas mensajes aparecerán en este listado.'
            }
          />
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                  notification.readFlag
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    : 'border-primary-300 dark:border-primary-600 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold ${
                        notification.readFlag 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-white'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.readFlag && (
                        <span className="h-2 w-2 rounded-full bg-white flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${
                      notification.readFlag 
                        ? 'text-slate-600 dark:text-slate-400' 
                        : 'text-white/90'
                    }`}>
                      {notification.message}
                    </p>
                    <span className={`text-xs ${
                      notification.readFlag 
                        ? 'text-slate-400 dark:text-slate-500' 
                        : 'text-white/70'
                    }`}>
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {query.data && query.data.totalPages > 1 && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <PaginationControls
              page={query.data.page}
              size={query.data.size}
              totalPages={query.data.totalPages}
              totalElements={query.data.totalElements}
              onPageChange={(nextPage) => updateParam('page', nextPage)}
              onSizeChange={(nextSize) => updateParam('size', nextSize)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
