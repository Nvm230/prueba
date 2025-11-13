import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import StatusBadge from '@/components/data/StatusBadge';
import { fetchEventDetail } from '@/services/eventService';
import { registerForEvent } from '@/services/registrationService';
import { useToast } from '@/contexts/ToastContext';
import { formatDateTime } from '@/utils/formatters';
import { useState } from 'react';

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [ticket, setTicket] = useState<string | null>(null);

  const {
    data: event,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: ({ signal }) => fetchEventDetail(Number(eventId), signal),
    enabled: Boolean(eventId)
  });

  const mutation = useMutation({
    mutationKey: ['register', eventId],
    mutationFn: () => registerForEvent(Number(eventId)),
    onSuccess: (response) => {
      setTicket(response.qrBase64);
      pushToast({ type: 'success', title: 'Registro exitoso', description: 'Tu QR está listo para el check-in.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'No se pudo registrar', description: error.message });
    }
  });

  if (isLoading) {
    return <LoadingOverlay message="Cargando evento" />;
  }

  if (isError || !event) {
    return <EmptyState title="Evento no encontrado" description="Verifica el enlace e intenta nuevamente." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: event.title }]} />
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-8 shadow-soft space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{event.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300 max-w-2xl">{event.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">{event.category}</span>
              {event.faculty && <span>{event.faculty}</span>}
              {event.career && <span>{event.career}</span>}
            </div>
          </div>
          <StatusBadge status={event.status} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-6 space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Detalles</h2>
            <p className="text-sm text-slate-600 dark:text-slate-200">Inicio: {formatDateTime(event.startTime)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-200">Fin: {formatDateTime(event.endTime)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-200">
              Tags:{' '}
              {event.tags.length > 0 ? event.tags.map((tag) => `#${tag}`).join(', ') : 'Sin etiquetas'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-primary-600/10 p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-200">Regístrate</h2>
              <p className="text-sm text-primary-700/80 dark:text-primary-200/80">
                Genera tu QR personal para hacer check-in más rápido.
              </p>
            </div>
            <button
              type="button"
              onClick={() => mutation.mutate()}
              className="self-start rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-500 disabled:opacity-50"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Registrando…' : 'Generar QR'}
            </button>
            {ticket && (
              <div className="flex flex-col items-center gap-2">
                <img src={`data:image/png;base64,${ticket}`} alt="QR de evento" className="h-40 w-40" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Muestra este código en el acceso.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
