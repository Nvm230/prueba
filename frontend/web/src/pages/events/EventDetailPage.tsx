import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import StatusBadge from '@/components/data/StatusBadge';
import ChatWindow from '@/components/chat/ChatWindow';
import TextField from '@/components/forms/TextField';
import { fetchEventDetail, startEvent, finishEvent, fetchEventRegistrations, fetchEventStats, fetchCheckInPassword, fetchEventRegistrationQr, updateEvent, deleteEvent } from '@/services/eventService';
import { registerForEvent, getRegistration, scanEventQr } from '@/services/registrationService';
import { checkInWithPassword } from '@/services/checkInService';
import { syncEventToGoogleCalendar } from '@/services/calendarService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDateTime } from '@/utils/formatters';
import { RegisteredUser, EventStats, CheckInPasswordResponse } from '@/types';
import { CallSession, createCallSession, getActiveCall, CallMode } from '@/services/callService';
import CallOverlay from '@/components/chat/CallOverlay';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  QrCodeIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  StopIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import ReportModal from '@/components/forms/ReportModal';
import { createReport } from '@/services/reportService';

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const { primaryColor } = useTheme();
  const [checkInPassword, setCheckInPassword] = useState<string>('');
  const [checkInFeedback, setCheckInFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [joiningCall, setJoiningCall] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    data: event,
    isLoading,
    isError,
    error: eventError
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: ({ signal }) => fetchEventDetail(Number(eventId), signal),
    enabled: Boolean(eventId),
    refetchInterval: 5000
  });

  // Verificar si el usuario es creador o admin (solo después de que event esté cargado)
  const isCreator = event && user && event.createdBy?.id === user.id;
  const isAdmin = user?.role === 'ADMIN';
  const isAdminOrServer = user && (user.role === 'ADMIN' || user.role === 'SERVER');
  const canViewDetails = Boolean(event && user && (isAdmin || isCreator || isAdminOrServer));

  // Query para registrados
  const { data: registrationsData } = useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: ({ signal }) => fetchEventRegistrations(Number(eventId), signal),
    enabled: Boolean(eventId && event),
    refetchInterval: canViewDetails ? 5000 : false
  });

  // Query para estadísticas (solo creador/admin)
  const { data: stats } = useQuery<EventStats>({
    queryKey: ['event-stats', eventId],
    queryFn: ({ signal }) => fetchEventStats(Number(eventId), signal),
    enabled: Boolean(eventId && event && user && (isAdmin || isCreator)),
    refetchInterval: event && user && (isAdmin || isCreator) ? 5000 : false
  });

  // Query para contraseña de check-in (solo creador/admin)
  const { data: checkInPasswordData } = useQuery<CheckInPasswordResponse>({
    queryKey: ['event-checkin-password', eventId],
    queryFn: ({ signal }) => fetchCheckInPassword(Number(eventId), signal),
    enabled: Boolean(eventId && event && user && (isAdmin || isCreator))
  });

  // Query para obtener el QR de registro del evento
  const { data: eventQrData, isLoading: loadingQr, error: qrError } = useQuery({
    queryKey: ['event-registration-qr', eventId],
    queryFn: ({ signal }) => fetchEventRegistrationQr(Number(eventId), signal),
    enabled: Boolean(eventId && (!event || event.status !== 'FINISHED')),
    retry: false
  });

  // Query para verificar si el usuario ya está registrado
  const { data: userRegistration, refetch: refetchRegistration } = useQuery({
    queryKey: ['user-registration', eventId],
    queryFn: ({ signal }) => getRegistration(Number(eventId), signal),
    enabled: Boolean(eventId && event && user && event.status !== 'FINISHED'),
    retry: false
  });
  const isCheckedIn = userRegistration?.status === 'CHECKED_IN';
  const checkedInAt = userRegistration?.checkedInAt
    ? formatDateTime(userRegistration.checkedInAt)
    : null;

  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(Number(eventId)),
    onSuccess: (response) => {
      pushToast({ type: 'success', title: 'Registro exitoso', description: 'Te has registrado al evento exitosamente.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
      refetchRegistration();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al registrarse';
      pushToast({ type: 'error', title: 'No se pudo registrar', description: errorMessage });
    }
  });

  const scanQrMutation = useMutation({
    mutationFn: (qrPayload: string) => scanEventQr(qrPayload),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Registro exitoso', description: 'Te has registrado al evento escaneando el QR.' });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-registration', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
      refetchRegistration();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al escanear el QR';
      pushToast({ type: 'error', title: 'No se pudo registrar', description: errorMessage });
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

  const checkInPasswordMutation = useMutation({
    mutationFn: (password: string) => checkInWithPassword(Number(eventId), password),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Check-in exitoso', description: 'Tu asistencia ha sido registrada.' });
      setCheckInFeedback({ success: true, message: '¡Listo! Tu asistencia quedó registrada.' });
      setCheckInPassword('');
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-stats', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-registration', eventId] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Contraseña incorrecta o evento no disponible';
      setCheckInFeedback({ success: false, message });
      pushToast({ type: 'error', title: 'Error en check-in', description: message });
    }
  });

  const reportMutation = useMutation({
    mutationFn: ({ reason, details }: { reason: string; details: string }) =>
      createReport({
        type: 'EVENT',
        targetId: Number(eventId),
        reason,
        details
      }),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Reporte enviado', description: 'Tu reporte ha sido enviado a los administradores.' });
      setShowReportModal(false);
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo enviar el reporte.' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Evento eliminado', description: 'El evento ha sido eliminado exitosamente.' });
      navigate('/events');
    },
    onError: (error: any) => {
      const description = error?.response?.data?.error || error.message || 'No se pudo eliminar el evento';
      pushToast({ type: 'error', title: 'Error', description });
    }
  });

  const canManageEvent = user && (user.role === 'ADMIN' || user.role === 'SERVER');
  const canEditEvent = isAdmin || isCreator;
  const canDeleteEvent = isAdmin;
  const isServer = user?.role === 'SERVER';
  
  // Validar si el botón "Iniciar Evento" debe estar habilitado
  // Para SERVER: solo 5 minutos antes del inicio
  // Para ADMIN: siempre habilitado
  const canStartEvent = useMemo(() => {
    if (!event || !canManageEvent || event.status !== 'PENDING') return false;
    if (isAdmin) return true; // ADMIN siempre puede iniciar
    if (isServer && event.startTime) {
      const now = new Date();
      const startTime = new Date(event.startTime);
      const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);
      return diffMinutes <= 5 && diffMinutes >= 0; // Solo en los 5 minutos antes del inicio
    }
    return false;
  }, [event, canManageEvent, isAdmin, isServer]);

  const refreshActiveCall = useCallback(async () => {
    if (!event) return;
    try {
      const active = await getActiveCall('EVENT', event.id);
      setActiveCall(active);
    } catch (error) {
      console.error('No se pudo obtener el estado de la llamada', error);
    }
  }, [event]);

  useEffect(() => {
    if (event?.status === 'LIVE') {
      refreshActiveCall();
    } else {
      setActiveCall(null);
    }
  }, [event?.status, refreshActiveCall]);

  const handleStartCall = async (mode: CallMode) => {
    if (!event) return;
    setJoiningCall(true);
    try {
      const session = await createCallSession({
        contextType: 'EVENT',
        contextId: event.id,
        mode
      });
      setActiveCall(session);
      setCurrentCall(session);
    } catch (error: any) {
      pushToast({
        type: 'error',
        title: 'No se pudo iniciar la llamada',
        description: error?.response?.data?.message || 'Intenta nuevamente.'
      });
    } finally {
      setJoiningCall(false);
    }
  };

  const handleJoinCall = async () => {
    if (!event) return;
    setJoiningCall(true);
    try {
      let session = activeCall;
      if (!session) {
        session = await getActiveCall('EVENT', event.id);
        if (!session) {
          pushToast({
            type: 'info',
            title: 'Sin llamada activa',
            description: 'El organizador aún no inicia la llamada.'
          });
          return;
        }
      }
      setCurrentCall(session);
    } catch (error) {
      pushToast({ type: 'error', title: 'Error', description: 'No fue posible unirse a la llamada.' });
    } finally {
      setJoiningCall(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Cargando evento" />;
  }

  if (isError || !event) {
    const status = (eventError as any)?.response?.status;
    const description =
      (eventError as any)?.response?.data?.error ||
      (eventError as any)?.response?.data?.message ||
      'Verifica el enlace e intenta nuevamente.';
    if (status === 403) {
      return <EmptyState title="Evento privado" description={description} />;
    }
    return <EmptyState title="Evento no encontrado" description={description} />;
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
            {event.groupRestricted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                Privado (solo miembros de grupo)
                </span>
              )}
            </div>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <span 
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium"
                style={{ color: primaryColor }}
              >
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
          
          {/* Report Button */}
          {user && !isCreator && (
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
            >
              <FlagIcon className="h-4 w-4" />
              Reportar
            </button>
          )}
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
                    disabled={startMutation.isLoading || !canStartEvent}
                    className="btn-primary text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!canStartEvent && isServer ? 'El botón estará disponible 5 minutos antes del inicio del evento' : ''}
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

      {event.status === 'LIVE' && (
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Salas de audio y video</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Conecta con los asistentes mediante videollamadas en vivo.
              </p>
            </div>
            {activeCall && (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                En curso
              </span>
            )}
          </div>
          {canEditEvent ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleStartCall('NORMAL')}
                className="btn-primary inline-flex items-center gap-2"
                disabled={joiningCall}
              >
                <VideoCameraIcon className="h-5 w-5" />
                {joiningCall ? 'Activando...' : 'Iniciar modo normal'}
              </button>
              <button
                type="button"
                onClick={() => handleStartCall('CONFERENCE')}
                className="btn-secondary inline-flex items-center gap-2"
                disabled={joiningCall}
              >
                <MegaphoneIcon className="h-5 w-5" />
                {joiningCall ? 'Activando...' : 'Iniciar modo conferencia'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {userRegistration ? (
                <button
                  type="button"
                  onClick={handleJoinCall}
                  className="btn-primary inline-flex items-center gap-2"
                  disabled={joiningCall || !activeCall}
                >
                  <VideoCameraIcon className="h-5 w-5" />
                  {joiningCall ? 'Conectando...' : activeCall ? 'Unirse a la llamada' : 'Esperando al organizador'}
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>Debes estar registrado al evento para unirte a la conferencia</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Registration & Check-in Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Registration Card - Solo mostrar si el evento no está FINISHED */}
        {event.status !== 'FINISHED' && (
          <div className="card bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3 mb-4">
              <QrCodeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registro al Evento</h2>
            </div>
            {event.groupRestricted && (
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                Este evento es privado para miembros del grupo que lo organiza. Asegúrate de pertenecer al grupo antes de intentar registrarte.
              </p>
            )}
            {loadingQr ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-slate-500 dark:text-slate-400">Cargando QR...</div>
              </div>
            ) : qrError ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Error al cargar el QR. Intenta registrarte directamente.
                </p>
                {user && (
                  <button
                    type="button"
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isLoading}
                    className="btn-primary w-full"
                  >
                    {registerMutation.isLoading ? 'Registrando...' : 'Registrarse al Evento'}
                  </button>
                )}
              </div>
            ) : eventQrData ? (
              <div className="space-y-4">
                {userRegistration && (
                  <div className="mb-2 p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20 space-y-1">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                      {isCheckedIn ? '✓ Ya realizaste el check-in para este evento' : '✓ Ya estás registrado en este evento'}
                    </p>
                    {isCheckedIn && checkedInAt && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Validado el {checkedInAt}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80">
                  <img
                    src={`data:image/png;base64,${eventQrData.qrBase64}`}
                    alt="QR de registro"
                    className="h-48 w-48 rounded-xl border-4 border-white dark:border-slate-700 shadow-lg"
                  />
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
                    QR de registro
                  </p>
                </div>
                {user && !userRegistration && (
                  <button
                    type="button"
                    onClick={() => scanQrMutation.mutate(eventQrData.payload)}
                    disabled={scanQrMutation.isLoading}
                    className="btn-primary w-full"
                  >
                    {scanQrMutation.isLoading ? 'Registrando...' : 'Registrarse'}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                  Regístrate al evento para obtener tu código QR personal y poder hacer check-in.
                </p>
                {user && (
                  <button
                    type="button"
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isLoading}
                    className="btn-primary w-full"
                  >
                    {registerMutation.isLoading ? 'Registrando...' : 'Registrarse al Evento'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Check-in con contraseña - Solo cuando el evento está LIVE */}
        {event.status === 'LIVE' && user && (
          <div className="card bg-gradient-to-br from-success-50/50 to-success-100/30 dark:from-success-900/20 dark:to-success-800/10 border-success-200 dark:border-success-800">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Check-in</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Cuando el organizador active el evento compartirá una contraseña. Ingresa ese código para confirmar tu asistencia.
            </p>
            {isCheckedIn ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20 p-4 space-y-1">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Tu asistencia ya fue validada para este evento.
                </p>
                {checkedInAt && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Check-in registrado el {checkedInAt}.</p>
                )}
              </div>
            ) : userRegistration ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (checkInPassword.trim()) {
                      checkInPasswordMutation.mutate(checkInPassword.trim());
                    }
                  }}
                  className="space-y-4"
                >
                  <TextField
                    type="password"
                    value={checkInPassword}
                    onChange={(e) => {
                      setCheckInPassword(e.target.value);
                      setCheckInFeedback(null);
                    }}
                    placeholder="Contraseña de check-in"
                    required
                    className="w-full"
                  />
                  <button
                    type="submit"
                    disabled={checkInPasswordMutation.isLoading || !checkInPassword.trim()}
                    className="btn-primary w-full"
                  >
                    {checkInPasswordMutation.isLoading ? 'Procesando...' : 'Confirmar asistencia'}
                  </button>
                </form>
                {checkInFeedback && (
                  <div
                    className={`mt-4 rounded-xl p-3 ${
                      checkInFeedback.success
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        checkInFeedback.success ? 'text-emerald-800 dark:text-emerald-200' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {checkInFeedback.message}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Regístrate primero usando el QR del evento para habilitar el check-in.
              </p>
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

      {/* Estadísticas y Registrados - Solo para creador/admin */}
      {(isAdmin || isCreator) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Estadísticas */}
          {stats && (
            <div className="card bg-gradient-to-br from-info-50/50 to-info-100/30 dark:from-info-900/20 dark:to-info-800/10 border-info-200 dark:border-info-800">
              <div className="flex items-center gap-3 mb-4">
                <ChartBarIcon className="h-6 w-6 text-info-600 dark:text-info-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Estadísticas</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Total Inscritos:</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalRegistrations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Check-in Realizados:</span>
                  <span className="text-lg font-bold text-success-600 dark:text-success-400">{stats.checkedInCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Pendientes de Check-in:</span>
                  <span className="text-lg font-bold text-warning-600 dark:text-warning-400">{stats.pendingCheckInCount}</span>
                </div>
                {stats.lastCheckInAt && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Último check-in: {formatDateTime(stats.lastCheckInAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contraseña de Check-in */}
          {checkInPasswordData && (
            <div className="card bg-gradient-to-br from-warning-50/50 to-warning-100/30 dark:from-warning-900/20 dark:to-warning-800/10 border-warning-200 dark:border-warning-800">
              <div className="flex items-center gap-3 mb-4">
                <KeyIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contraseña de Check-in</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/80">
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Contraseña única del evento:</p>
                  <p className="text-2xl font-bold text-center text-slate-900 dark:text-white font-mono tracking-wider">
                    {checkInPasswordData.password}
                  </p>
                </div>
                {checkInPasswordData.qrCodeBase64 && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={`data:image/png;base64,${checkInPasswordData.qrCodeBase64}`}
                      alt="QR de contraseña"
                      className="h-32 w-32 rounded-xl border-2 border-white dark:border-slate-700"
                    />
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                      Escanea este QR para compartir la contraseña
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de Registrados */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Participantes</h2>
        </div>
        {canViewDetails && Array.isArray(registrationsData) ? (
          <div className="space-y-2">
            {registrationsData.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Aún no hay participantes registrados.</p>
            ) : (
              <div className="space-y-2">
                {(registrationsData as RegisteredUser[]).map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{reg.name}</p>
                      {reg.email && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{reg.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <StatusBadge status={reg.status === 'CHECKED_IN' ? 'LIVE' : 'PENDING'} />
                      {reg.checkedInAt && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {formatDateTime(reg.checkedInAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {(registrationsData as any)?.count || 0}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">personas inscritas</p>
          </div>
        )}
      </div>

      {/* Acciones de Edición y Eliminación */}
      {(canEditEvent || canDeleteEvent) && (
        <div className="card">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Gestión del Evento</h3>
          <div className="flex gap-3">
            {canEditEvent && (
              <button
                onClick={() => navigate(`/events/${eventId}/edit`)}
                className="btn-secondary flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Editar Evento
              </button>
            )}
            {canDeleteEvent && (
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isLoading}
                className="btn-danger flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                {deleteMutation.isLoading ? 'Eliminando...' : 'Eliminar Evento'}
              </button>
            )}
          </div>
        </div>
      )}

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
      {currentCall && (
        <CallOverlay
          session={currentCall}
          onClose={() => {
            setCurrentCall(null);
            refreshActiveCall();
          }}
        />
      )}
      
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="EVENT"
        targetId={Number(eventId)}
        targetName={event.title}
        onSubmit={(reason, details) => reportMutation.mutateAsync({ reason, details })}
      />
    </div>
  );
};

export default EventDetailPage;
