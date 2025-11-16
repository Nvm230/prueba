import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import StatusBadge from '@/components/data/StatusBadge';
import ChatWindow from '@/components/chat/ChatWindow';
import { fetchEventDetail, startEvent, finishEvent } from '@/services/eventService';
import { registerForEvent } from '@/services/registrationService';
import { syncEventToGoogleCalendar } from '@/services/calendarService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { formatDateTime } from '@/utils/formatters';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  QrCodeIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  StopIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<string | null>(null);

  const {
    data: event,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: ({ signal }) => fetchEventDetail(Number(eventId), signal),
    enabled: Boolean(eventId),
    refetchInterval: 5000
  });

  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(Number(eventId)),
    onSuccess: (response) => {
      setTicket(response.qrBase64);
      pushToast({ type: 'success', title: 'Registro exitoso', description: 'Tu QR está listo para el check-in.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'No se pudo registrar', description: error.message || 'Error al registrarse' });
    }
  });

  const startMutation = useMutation({
    mutationFn: () => startEvent(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Evento iniciado', description: 'El chat ahora está activo.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo iniciar el evento' });
    }
  });

  const finishMutation = useMutation({
    mutationFn: () => finishEvent(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Evento finalizado', description: 'El evento ha sido marcado como finalizado.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo finalizar el evento' });
    }
  });

  const calendarMutation = useMutation({
    mutationFn: () => syncEventToGoogleCalendar(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Sincronizado', description: 'Evento agregado a Google Calendar. Los usuarios registrados recibirán una invitación.' });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo sincronizar con Google Calendar. Verifica que GOOGLE_CALENDAR_ACCESS_TOKEN esté configurado.' });
    }
  });


  const canManageEvent = user && (user.role === 'ADMIN' || user.role === 'SERVER');

  if (isLoading) {
    return <LoadingOverlay message="Cargando evento" />;
  }

  if (isError || !event) {
    return <EmptyState title="Evento no encontrado" description="Verifica el enlace e intenta nuevamente." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: event.title }]} />
      
      {/* Header Card */}
      <div className="card space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold gradient-text">{event.title}</h1>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                {event.category}
              </span>
              {event.faculty && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                  <MapPinIcon className="h-4 w-4" />
                  {event.faculty}
                </span>
              )}
              {event.career && (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300">
                  {event.career}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 p-5">
            <div className="flex items-center gap-3 mb-2">
              <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Inicio</h3>
            </div>
            <p className="text-base font-medium text-slate-900 dark:text-white">{formatDateTime(event.startTime)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 p-5">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Fin</h3>
            </div>
            <p className="text-base font-medium text-slate-900 dark:text-white">{formatDateTime(event.endTime)}</p>
          </div>
          {canManageEvent && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-warning-50 to-warning-100/30 dark:from-warning-900/20 dark:to-warning-800/10 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">Acciones</h3>
              <div className="flex flex-col gap-2">
                {event.status === 'PENDING' && (
                  <button
                    onClick={() => startMutation.mutate()}
                    disabled={startMutation.isLoading}
                    className="btn-primary text-sm py-2 flex items-center justify-center gap-2"
                  >
                    <PlayIcon className="h-4 w-4" />
                    {startMutation.isLoading ? 'Iniciando...' : 'Iniciar Evento'}
                  </button>
                )}
                {event.status === 'LIVE' && (
                  <button
                    onClick={() => finishMutation.mutate()}
                    disabled={finishMutation.isLoading}
                    className="btn-secondary text-sm py-2 flex items-center justify-center gap-2"
                  >
                    <StopIcon className="h-4 w-4" />
                    {finishMutation.isLoading ? 'Finalizando...' : 'Finalizar Evento'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Registration & Calendar Sync */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Card - Solo mostrar si el evento no está FINISHED */}
        {event.status !== 'FINISHED' && (
          <div className="card bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3 mb-4">
              <QrCodeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registro al Evento</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Genera tu código QR personal para hacer check-in de manera rápida y sencilla.
            </p>
            {!ticket ? (
              <button
                type="button"
                onClick={() => registerMutation.mutate()}
                disabled={registerMutation.isLoading}
                className="btn-primary w-full"
              >
                {registerMutation.isLoading ? 'Generando QR...' : 'Generar Código QR'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80">
                  <img
                    src={`data:image/png;base64,${ticket}`}
                    alt="QR de evento"
                    className="h-48 w-48 rounded-xl border-4 border-white dark:border-slate-700 shadow-lg"
                  />
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                    Muestra este código en el acceso al evento
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTicket(null)}
                  className="btn-secondary w-full text-sm"
                >
                  Generar Nuevo QR
                </button>
              </div>
            )}
          </div>
        )}

        {/* Google Calendar Sync - Solo para ADMIN/SERVER y solo cuando el evento está PENDING */}
        {canManageEvent && event.status === 'PENDING' && (
          <div className="card bg-gradient-to-br from-success-50/50 to-success-100/30 dark:from-success-900/20 dark:to-success-800/10 border-success-200 dark:border-success-800">
            <div className="flex items-center gap-3 mb-4">
              <CloudArrowUpIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Google Calendar</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Sincroniza este evento con Google Calendar. Los usuarios registrados recibirán una invitación automáticamente.
            </p>
            <button
              type="button"
              onClick={() => calendarMutation.mutate()}
              disabled={calendarMutation.isLoading}
              className="btn-primary w-full"
            >
              {calendarMutation.isLoading ? 'Sincronizando...' : 'Sincronizar con Google Calendar'}
            </button>
          </div>
        )}
      </div>

      {/* Chat Section - Always visible, shows history even after event ends */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {event.status === 'LIVE' ? 'Chat en Vivo' : 'Historial de Chat'}
          </h2>
        </div>
        <ChatWindow eventId={Number(eventId!)} eventStatus={event.status} isLive={event.status === 'LIVE'} />
      </div>
    </div>
  );
};

export default EventDetailPage;
