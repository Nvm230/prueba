import { useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import SubmitButton from '@/components/forms/SubmitButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSupportTicket,
  getMySupportTickets,
  getSupportTicket,
  SupportMessage,
  SupportTicketStatus
} from '@/services/supportService';
import { useToast } from '@/contexts/ToastContext';

const statusLabels: Record<SupportTicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrado'
};

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { logout, user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';

  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  const { data: myTickets = [], refetch: refetchMy } = useQuery({
    queryKey: ['support', 'my'],
    queryFn: getMySupportTickets,
    enabled: !isAdmin
  });

  const crearTicket = useMutation({
    mutationFn: () => createSupportTicket({ asunto, categoria, mensaje }),
    onSuccess: (ticket) => {
      pushToast({ type: 'success', title: 'Mensaje enviado', description: 'El equipo de soporte te responderá pronto.' });
      setAsunto('');
      setCategoria('');
      setMensaje('');
      refetchMy();
    },
    onError: () => {
      pushToast({ type: 'error', title: 'Error', description: 'No pudimos enviar tu solicitud. Intenta nuevamente.' });
    }
  });

  const ticketsParaMostrar = myTickets;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) {
      pushToast({ type: 'error', title: 'Campos obligatorios', description: 'Completa el asunto y el mensaje.' });
      return;
    }
    crearTicket.mutate();
  };

  const renderMensajes = (mensajes: SupportMessage[] | undefined) => {
    console.log('[SettingsPage] renderMensajes called with:', mensajes);
    if (!mensajes || mensajes.length === 0) {
      return <p className="text-sm text-slate-500">Aún no hay respuestas.</p>;
    }
    return (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {mensajes.map((msg) => (
          <div key={msg.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{msg.sender?.nombre || 'Usuario'}</span>
              <span>{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-100 whitespace-pre-wrap">{msg.contenido}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Configuración' }]} />

      <div className={`grid ${isAdmin ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-6 shadow-soft">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Preferencias generales</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza tu experiencia en UniVibe.</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Tema</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Alterna entre modo claro y oscuro.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`rounded-full px-4 py-1 text-sm ${theme === 'light' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Claro
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`rounded-full px-4 py-1 text-sm ${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  Oscuro
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-500/10 px-4 py-4">
              <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-200">Cerrar sesión</h2>
              <p className="text-xs text-rose-600 dark:text-rose-300">Finaliza tu sesión actual de forma segura.</p>
              <SubmitButton onClick={logout} className="mt-3 bg-rose-600 hover:bg-rose-500">
                Cerrar sesión
              </SubmitButton>
            </div>
          </div>
        </div>

        {!isAdmin && (
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900 p-6 shadow-soft space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contacto con soporte</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cuéntanos qué necesitas y te responderemos desde el panel de administración.
              </p>
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Asunto</label>
                <input
                  type="text"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="input-field mt-1"
                  placeholder="Ej. Problemas con eventos privados"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Categoría</label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="input-field mt-1"
                  placeholder="Opcional"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mensaje</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="input-field mt-1"
                  rows={4}
                  placeholder="Describe lo que necesitas..."
                />
              </div>
              <SubmitButton loading={crearTicket.isLoading} className="w-full">
                Enviar a soporte
              </SubmitButton>
            </form>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900 p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Mis solicitudes</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Revisa el estado de tus conversaciones con soporte.
              </p>
            </div>
          </div>
        <div className="space-y-3">
          {ticketsParaMostrar.length === 0 ? (
            <p className="text-sm text-slate-500">No hay tickets registrados.</p>
          ) : (
            ticketsParaMostrar.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{ticket.asunto}</h3>
                    <p className="text-xs text-slate-500">
                      Creado el {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticket.estado === 'OPEN'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : ticket.estado === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    }`}
                  >
                    {statusLabels[ticket.estado]}
                  </span>
                </div>
                {renderMensajes(ticket.mensajes)}
              </div>
            ))
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
