import { useState } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllSupportTickets,
  getSupportTicket,
  replySupportTicket,
  updateSupportTicketStatus,
  SupportMessage,
  SupportTicket,
  SupportTicketStatus
} from '@/services/supportService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import EmptyState from '@/components/display/EmptyState';

const statusLabels: Record<SupportTicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrado'
};

const AdminSupportPage = () => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [respuesta, setRespuesta] = useState('');

  const { data: allTickets = [] } = useQuery({
    queryKey: ['support', 'all'],
    queryFn: getAllSupportTickets,
    enabled: Boolean(user && user.role === 'ADMIN')
  });

  const { data: ticketDetalle } = useQuery({
    queryKey: ['support', 'ticket', selectedTicketId],
    queryFn: () => getSupportTicket(selectedTicketId!),
    enabled: Boolean(selectedTicketId && user && user.role === 'ADMIN')
  });

  const responderTicket = useMutation({
    mutationFn: () => replySupportTicket(selectedTicketId!, respuesta),
    onSuccess: () => {
      setRespuesta('');
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket', selectedTicketId] });
      queryClient.invalidateQueries({ queryKey: ['support', 'all'] });
      pushToast({ type: 'success', title: 'Respuesta enviada', description: 'La respuesta fue enviada al usuario.' });
    },
    onError: () => {
      pushToast({ type: 'error', title: 'Error', description: 'No se pudo enviar la respuesta.' });
    }
  });

  const actualizarEstado = useMutation({
    mutationFn: (estado: SupportTicketStatus) => updateSupportTicketStatus(selectedTicketId!, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['support', 'ticket', selectedTicketId] });
      pushToast({ type: 'success', title: 'Estado actualizado', description: 'El estado del ticket fue actualizado.' });
    },
    onError: () => {
      pushToast({ type: 'error', title: 'Error', description: 'No se pudo actualizar el estado.' });
    }
  });

  const renderMensajes = (mensajes: SupportMessage[]) => {
    if (!mensajes.length) {
      return <p className="text-sm text-slate-500">Aún no hay respuestas.</p>;
    }
    return (
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {mensajes.map((msg) => (
          <div key={msg.id} className="rounded-2xl bg-slate-50 dark:bg-slate-800 px-4 py-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{msg.sender.nombre}</span>
              <span>{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-100 whitespace-pre-wrap">{msg.contenido}</p>
          </div>
        ))}
      </div>
    );
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Soporte' }]} />
        <EmptyState
          title="Acceso restringido"
          description="Solo los administradores pueden gestionar los tickets de soporte."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Administración', to: '/admin/users' }, { label: 'Soporte' }]} />
      
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900 p-6 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tickets de soporte</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gestiona las solicitudes de soporte de los usuarios.
            </p>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {allTickets.length === 0 ? (
              <p className="text-sm text-slate-500">No hay tickets registrados.</p>
            ) : (
              allTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedTicketId === ticket.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-100">{ticket.asunto}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        ticket.estado === 'OPEN'
                          ? 'bg-amber-100 text-amber-700'
                          : ticket.estado === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {statusLabels[ticket.estado]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {ticket.solicitante.nombre} · {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
          <div className="lg:col-span-2">
            {selectedTicketId && ticketDetalle ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{ticketDetalle.asunto}</h3>
                    <p className="text-xs text-slate-500">
                      Creado por {ticketDetalle.solicitante.nombre} ·{' '}
                      {new Date(ticketDetalle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    value={ticketDetalle.estado}
                    onChange={(e) => actualizarEstado.mutate(e.target.value as SupportTicketStatus)}
                    disabled={ticketDetalle.estado === 'CLOSED'}
                    className="input-field text-sm max-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="OPEN">Abierto</option>
                    <option value="IN_PROGRESS">En progreso</option>
                    <option value="CLOSED">Cerrado</option>
                  </select>
                </div>
                {renderMensajes(ticketDetalle.mensajes)}
                {ticketDetalle.estado !== 'CLOSED' && (
                  <div className="space-y-2">
                    <textarea
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      rows={3}
                      className="input-field"
                      placeholder="Escribe una respuesta..."
                    />
                    <button
                      type="button"
                      onClick={() => responderTicket.mutate()}
                      disabled={!respuesta.trim() || responderTicket.isLoading}
                      className="btn-primary w-full"
                    >
                      {responderTicket.isLoading ? 'Enviando...' : 'Responder'}
                    </button>
                  </div>
                )}
                {ticketDetalle.estado === 'CLOSED' && (
                  <div className="rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    Este ticket está cerrado. No se pueden enviar más mensajes.
                  </div>
                )}
              </div>
            ) : (
              <div className="h-60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                Selecciona un ticket para revisar la conversación.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;

