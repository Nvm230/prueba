import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import GroupChannelWindow from '@/components/chat/GroupChannelWindow';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import {
  fetchGroupDetail,
  getGroupMessages,
  getGroupAnnouncements,
  getGroupEvents,
  getGroupSurveys,
  createGroupAnnouncement,
  createGroupEvent,
  shareEventToGroup,
  shareSurveyToGroup,
  createGroupSurvey,
  joinGroup,
  fetchGroupJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  deleteGroup,
  toggleGroupChat
} from '@/services/groupService';
import { fetchSurveys } from '@/services/surveyService';
import SelectField from '@/components/forms/SelectField';
import { registerForEvent } from '@/services/registrationService';
import {
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ArrowRightIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import ReportModal from '@/components/forms/ReportModal';
import { createReport } from '@/services/reportService';
import { formatDateTime } from '@/utils/formatters';
import StatusBadge from '@/components/data/StatusBadge';
import Avatar from '@/components/display/Avatar';

const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'events' | 'surveys'>('messages');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showShareSurvey, setShowShareSurvey] = useState(false);
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: ({ signal }) => fetchGroupDetail(Number(groupId!), signal),
    enabled: Boolean(groupId)
  });

  // Calcular permisos basados en el grupo y usuario
  const members = group?.members ?? [];
  const isMember = Boolean(user && members.some((m) => m.id === user.id));
  const canManage = Boolean(
    user &&
      group &&
      (group.owner.id === user.id || user.role === 'SERVER' || user.role === 'ADMIN')
  );
  const canDeleteGroup = user?.role === 'ADMIN';

  const { data: joinRequests } = useQuery({
    queryKey: ['groupJoinRequests', groupId],
    queryFn: ({ signal }) => fetchGroupJoinRequests(Number(groupId!), signal),
    enabled: Boolean(groupId) && canManage
  });

  const { data: announcements } = useQuery({
    queryKey: ['groupAnnouncements', groupId],
    queryFn: ({ signal }) => getGroupAnnouncements(Number(groupId!), { page: 0, size: 20 }, signal),
    enabled: Boolean(groupId) && activeTab === 'announcements'
  });

  const { data: groupEvents } = useQuery({
    queryKey: ['groupEvents', groupId],
    queryFn: ({ signal }) => getGroupEvents(Number(groupId!), signal),
    enabled: Boolean(groupId) && activeTab === 'events'
  });

  const { data: groupSurveys } = useQuery({
    queryKey: ['groupSurveys', groupId],
    queryFn: ({ signal }) => getGroupSurveys(Number(groupId!), signal),
    enabled: Boolean(groupId) && activeTab === 'surveys'
  });

  const { data: availableSurveys } = useQuery({
    queryKey: ['surveys', 'all'],
    queryFn: ({ signal }) => fetchSurveys({}, signal),
    enabled: Boolean(canManage && activeTab === 'surveys')
  });

  const announcementForm = useForm<{ title: string; content: string }>();
  const eventForm = useForm<{
    title: string;
    category: string;
    description: string;
    faculty?: string;
    career?: string;
    startTime: string;
    endTime: string;
  }>();
  const surveyForm = useForm<{ title: string; questions: string }>();

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      createGroupAnnouncement(Number(groupId!), data),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Anuncio creado', description: 'El anuncio fue publicado en el grupo.' });
      setShowAnnouncement(false);
      announcementForm.reset();
      queryClient.invalidateQueries({ queryKey: ['groupAnnouncements', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo crear el anuncio' });
    }
  });

  const createEventMutation = useMutation({
    mutationFn: (data: {
      title: string;
      category: string;
      description: string;
      faculty?: string;
      career?: string;
      startTime: string;
      endTime: string;
    }) => createGroupEvent(Number(groupId!), data),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Evento creado', description: 'El evento fue creado y compartido en el grupo.' });
      setShowCreateEvent(false);
      eventForm.reset();
      queryClient.invalidateQueries({ queryKey: ['groupEvents', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo crear el evento' });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (eventId: number) => registerForEvent(eventId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Registrado', description: 'Te has registrado al evento exitosamente.' });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo registrar al evento' });
    }
  });

  const shareSurveyMutation = useMutation({
    mutationFn: (surveyId: number) => shareSurveyToGroup(Number(groupId!), surveyId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Encuesta compartida', description: 'La encuesta fue compartida en el grupo.' });
      setShowShareSurvey(false);
      setSelectedSurveyId(null);
      queryClient.invalidateQueries({ queryKey: ['groupSurveys', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo compartir la encuesta' });
    }
  });

  const createSurveyMutation = useMutation({
    mutationFn: (data: { title: string; questions: string[] }) => createGroupSurvey(Number(groupId!), data),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Encuesta creada', description: 'La encuesta fue creada y compartida en el grupo.' });
      setShowCreateSurvey(false);
      surveyForm.reset();
      queryClient.invalidateQueries({ queryKey: ['groupSurveys', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo crear la encuesta' });
    }
  });

  const joinMutation = useMutation({
    mutationFn: () => joinGroup(Number(groupId!), user?.id),
    onSuccess: (response) => {
      if (response.status === 'JOINED') {
        pushToast({ type: 'success', title: 'Unido al grupo', description: response.message || 'Ya puedes participar.' });
        queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      } else if (response.status === 'PENDING') {
        pushToast({ type: 'info', title: 'Solicitud enviada', description: response.message || 'Espera la aprobación del creador.' });
        queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      } else {
        pushToast({ type: 'info', title: 'Ya eres miembro', description: response.message || 'Accede al contenido del grupo.' });
      }
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'No se pudo unir', description: error.message || 'Intenta nuevamente más tarde.' });
    }
  });

  const approveRequestMutation = useMutation({
    mutationFn: (requestId: number) => approveJoinRequest(Number(groupId!), requestId),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Solicitud aprobada', description: 'El miembro fue agregado al grupo.' });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groupJoinRequests', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo aprobar la solicitud' });
    }
  });

  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: number) => rejectJoinRequest(Number(groupId!), requestId),
    onSuccess: () => {
      pushToast({ type: 'info', title: 'Solicitud rechazada', description: 'El usuario fue notificado.' });
      queryClient.invalidateQueries({ queryKey: ['groupJoinRequests', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo rechazar la solicitud' });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroup(Number(groupId!)),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Grupo eliminado', description: 'El grupo se eliminó correctamente.' });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      navigate('/groups');
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'No se pudo eliminar', description: error.message || 'Intenta nuevamente.' });
    }
  });

  const toggleChatMutation = useMutation({
    mutationFn: () => toggleGroupChat(Number(groupId!)),
    onSuccess: (data) => {
      pushToast({ type: 'success', title: 'Configuración actualizada', description: data.message });
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error', description: error.message || 'No se pudo actualizar la configuración' });
    }
  });

  const reportMutation = useMutation({
    mutationFn: ({ reason, details }: { reason: string; details: string }) =>
      createReport({
        type: 'GROUP',
        targetId: Number(groupId!),
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

  if (groupLoading) {
    return <LoadingOverlay message="Cargando grupo" />;
  }

  if (!group) {
    return <EmptyState title="Grupo no encontrado" description="El grupo que buscas no existe." />;
  }

  if (!isMember) {
    const isPrivateGroup = group.privacy === 'PRIVATE';
    return (
      <div className="space-y-6 animate-fade-in">
        <Breadcrumbs items={[{ label: 'Grupos', to: '/groups' }, { label: group.name }]} />
        <div className="card text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No eres miembro de este grupo</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Este grupo es {isPrivateGroup ? 'privado' : 'público'}. {isPrivateGroup
              ? 'Necesitas solicitar acceso y esperar la aprobación del creador.'
              : 'Puedes unirte inmediatamente para participar.'}
          </p>
          {group.pendingJoinRequest ? (
            <p className="text-sm text-primary-600 font-medium">
              Ya enviaste una solicitud. Espera la aprobación del creador.
            </p>
          ) : (
            <button
              onClick={() => joinMutation.mutate()}
              className="btn-primary w-full md:w-auto"
              disabled={joinMutation.isLoading}
            >
              {joinMutation.isLoading ? 'Procesando...' : isPrivateGroup ? 'Solicitar acceso' : 'Unirse al grupo'}
            </button>
          )}
          <button onClick={() => navigate('/groups')} className="btn-secondary w-full md:w-auto">
            Volver a grupos
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'messages', name: 'Mensajes', icon: ChatBubbleLeftRightIcon },
    { id: 'announcements', name: 'Anuncios', icon: MegaphoneIcon },
    { id: 'events', name: 'Eventos', icon: CalendarDaysIcon },
    { id: 'surveys', name: 'Encuestas', icon: ClipboardDocumentListIcon }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Grupos', to: '/groups' }, { label: group.name }]} />

      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{group.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Administrado por {group.owner.name} • {group.members.length} miembros
            </p>
            <span
              className={`inline-flex items-center mt-2 text-xs font-semibold uppercase tracking-wide ${
                group.privacy === 'PRIVATE' ? 'text-rose-500' : 'text-emerald-500'
              }`}
            >
              {group.privacy === 'PRIVATE' ? 'Grupo privado' : 'Grupo público'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user && !canManage && (
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
              >
                <FlagIcon className="h-4 w-4" />
                Reportar
              </button>
            )}
            {canDeleteGroup && (
              <button
                onClick={() => {
                  if (deleteGroupMutation.isLoading) return;
                  if (window.confirm('¿Seguro que deseas eliminar este grupo? Esta acción no se puede deshacer.')) {
                    deleteGroupMutation.mutate();
                  }
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-error-600 hover:bg-error-500 transition-colors disabled:opacity-60"
                disabled={deleteGroupMutation.isLoading}
              >
                {deleteGroupMutation.isLoading ? 'Eliminando...' : 'Eliminar grupo'}
              </button>
            )}
            <div className="flex items-center gap-2">
              {group.members.slice(0, 5).map((member) => (
                <Avatar
                  key={member.id}
                  user={{
                    name: member.name,
                    profilePictureUrl: member.profilePictureUrl
                  }}
                  size="sm"
                />
              ))}
              {group.members.length > 5 && (
                <span className="text-sm text-slate-500 dark:text-slate-400">+{group.members.length - 5}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {canManage && joinRequests && joinRequests.length > 0 && (
        <div className="card border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-900/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              Solicitudes pendientes ({joinRequests.length})
            </h3>
          </div>
          <div className="space-y-3">
            {joinRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-white/70 dark:bg-slate-900/50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{request.user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{request.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-secondary !text-slate-600"
                    onClick={() => rejectRequestMutation.mutate(request.id)}
                    disabled={rejectRequestMutation.isLoading || approveRequestMutation.isLoading}
                  >
                    Rechazar
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => approveRequestMutation.mutate(request.id)}
                    disabled={approveRequestMutation.isLoading || rejectRequestMutation.isLoading}
                  >
                    Aprobar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <nav className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mensajes */}
        {activeTab === 'messages' && (
          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Canal de Mensajes</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {group?.membersCanChat
                    ? 'Todos los miembros pueden enviar mensajes en este canal.'
                    : 'Solo el administrador puede enviar mensajes en este canal.'}
                </p>
              </div>
              {canManage && (
                <button
                  onClick={() => toggleChatMutation.mutate()}
                  disabled={toggleChatMutation.isLoading}
                  className={`btn-secondary whitespace-nowrap ${
                    group?.membersCanChat ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300' : ''
                  }`}
                >
                  {toggleChatMutation.isLoading
                    ? 'Actualizando...'
                    : group?.membersCanChat
                    ? '🔒 Restringir Chat'
                    : '🔓 Habilitar Chat para Todos'}
                </button>
              )}
            </div>
            <GroupChannelWindow 
              groupId={Number(groupId!)} 
              canSend={!!(group?.membersCanChat ? isMember : canManage)} 
            />
          </div>
        )}

        {/* Anuncios */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {canManage && (
              <div className="mb-4">
                <button
                  onClick={() => setShowAnnouncement(!showAnnouncement)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Crear Anuncio
                </button>
              </div>
            )}
            {showAnnouncement && canManage && (
              <div className="card border-primary-200 dark:border-primary-800">
                <form
                  onSubmit={announcementForm.handleSubmit((data) => createAnnouncementMutation.mutate(data))}
                  className="space-y-4"
                >
                  <TextField
                    label="Título"
                    {...announcementForm.register('title', { required: true })}
                    required
                  />
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Contenido</span>
                    <textarea
                      rows={4}
                      className="mt-1 w-full input-field"
                      {...announcementForm.register('content', { required: true })}
                    />
                  </label>
                  <div className="flex gap-2">
                    <SubmitButton disabled={createAnnouncementMutation.isLoading}>Publicar</SubmitButton>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAnnouncement(false);
                        announcementForm.reset();
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!announcements || announcements.content.length === 0 ? (
              <EmptyState title="Sin anuncios" description="Aún no hay anuncios en este grupo." />
            ) : (
              <div className="space-y-3">
                {announcements.content.map((ann) => (
                  <div key={ann.id} className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                    <div className="flex items-start gap-3">
                      <MegaphoneIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{ann.title}</h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{ann.content}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Por {ann.sender.name} • {formatDateTime(ann.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Eventos */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {canManage && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setShowCreateEvent(!showCreateEvent)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Crear Evento
                </button>
              </div>
            )}
            {showCreateEvent && canManage && (
              <div className="card border-primary-200 dark:border-primary-800">
                <form
                  onSubmit={eventForm.handleSubmit((data) => {
                    const payload = {
                      ...data,
                      startTime: new Date(data.startTime).toISOString(),
                      endTime: new Date(data.endTime).toISOString(),
                      faculty: data.faculty || undefined,
                      career: data.career || undefined
                    };
                    createEventMutation.mutate(payload);
                  })}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Título" {...eventForm.register('title', { required: true })} required />
                    <TextField label="Categoría" {...eventForm.register('category', { required: true })} required />
                    <TextField label="Facultad" {...eventForm.register('faculty')} />
                    <TextField label="Carrera" {...eventForm.register('career')} />
                    <TextField
                      label="Fecha y hora de inicio"
                      type="datetime-local"
                      {...eventForm.register('startTime', { required: true })}
                      required
                    />
                    <TextField
                      label="Fecha y hora de fin"
                      type="datetime-local"
                      {...eventForm.register('endTime', { required: true })}
                      required
                    />
                  </div>
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Descripción</span>
                    <textarea rows={4} className="mt-1 w-full input-field" {...eventForm.register('description', { required: true })} />
                  </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Los eventos creados desde el grupo son privados y solo estarán visibles para los miembros de este espacio.
                </p>
                  <div className="flex gap-2">
                    <SubmitButton disabled={createEventMutation.isLoading}>Crear y Compartir</SubmitButton>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateEvent(false);
                        eventForm.reset();
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {!groupEvents || groupEvents.length === 0 ? (
              <EmptyState title="Sin eventos" description="Aún no hay eventos compartidos en este grupo." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {groupEvents.map((ge) => (
                  <div key={ge.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{ge.event.title}</h3>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={ge.event.status as any} />
                          {ge.event.visibility === 'PRIVATE' && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                              Privado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{ge.event.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                        {formatDateTime(ge.event.startTime)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Compartido por {ge.sharedBy.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/events/${ge.event.id}`)}
                        className="btn-secondary flex-1 text-sm"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => registerMutation.mutate(ge.event.id)}
                        disabled={registerMutation.isLoading}
                        className="btn-primary flex-1 text-sm inline-flex items-center justify-center gap-1"
                      >
                        Registrarse
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Encuestas */}
        {activeTab === 'surveys' && (
          <div className="space-y-4">
            {canManage && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setShowCreateSurvey(!showCreateSurvey)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Crear Encuesta
                </button>
                <button
                  onClick={() => setShowShareSurvey(!showShareSurvey)}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  Compartir Encuesta Existente
                </button>
              </div>
            )}
            {showCreateSurvey && canManage && (
              <div className="card border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Crear Encuesta para el Grupo</h3>
                <form
                  onSubmit={surveyForm.handleSubmit((data) => {
                    const questions = data.questions
                      .split('\n')
                      .map((q) => q.trim())
                      .filter(Boolean);
                    createSurveyMutation.mutate({ title: data.title, questions });
                  })}
                  className="space-y-4"
                >
                  <TextField
                    label="Título de la Encuesta"
                    {...surveyForm.register('title', { required: true })}
                    required
                  />
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">Preguntas</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Escribe cada pregunta en una línea separada
                    </p>
                    <textarea
                      rows={4}
                      className="mt-1 w-full input-field"
                      placeholder="¿Qué te parece el grupo?\n¿Qué actividades te gustaría hacer?\n¿Tienes alguna sugerencia?"
                      {...surveyForm.register('questions', { required: true })}
                    />
                  </label>
                  <div className="flex gap-2">
                    <SubmitButton disabled={createSurveyMutation.isLoading}>Crear y Compartir</SubmitButton>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateSurvey(false);
                        surveyForm.reset();
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
            {showShareSurvey && canManage && (
              <div className="card border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Compartir Encuesta en el Grupo</h3>
                <div className="space-y-4">
                  <SelectField
                    label="Seleccionar Encuesta"
                    value={selectedSurveyId?.toString() || ''}
                    onChange={(e) => setSelectedSurveyId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Selecciona una encuesta</option>
                    {availableSurveys?.map((survey) => (
                      <option key={survey.id} value={survey.id}>
                        {survey.title} {survey.event ? `- Evento: ${survey.event.title}` : '(Encuesta de grupo)'}
                      </option>
                    ))}
                  </SelectField>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedSurveyId) {
                          shareSurveyMutation.mutate(selectedSurveyId);
                        }
                      }}
                      disabled={shareSurveyMutation.isLoading || !selectedSurveyId}
                      className="btn-primary"
                    >
                      Compartir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowShareSurvey(false);
                        setSelectedSurveyId(null);
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!groupSurveys || groupSurveys.length === 0 ? (
              <EmptyState title="Sin encuestas" description="Aún no hay encuestas compartidas en este grupo." />
            ) : (
              <div className="space-y-3">
                {groupSurveys.map((gs) => (
                  <div key={gs.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{gs.survey.title}</h3>
                        {gs.survey.event && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Evento: {gs.survey.event.title}
                          </p>
                        )}
                        {!gs.survey.event && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Encuesta del grupo
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {gs.survey.event ? 'Compartida' : 'Creada'} por {gs.sharedBy.name}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/surveys`)}
                        className="btn-primary text-sm"
                      >
                        Responder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="GROUP"
        targetId={Number(groupId!)}
        targetName={group.name}
        onSubmit={(reason, details) => reportMutation.mutateAsync({ reason, details })}
      />
    </div>
  );
};

export default GroupDetailPage;

