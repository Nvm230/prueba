import { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import SubmitButton from '@/components/forms/SubmitButton';
import TextField from '@/components/forms/TextField';
import ImageUpload from '@/components/forms/ImageUpload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSupportTicket,
  getMySupportTickets,
  getSupportTicket,
  SupportMessage,
  SupportTicketStatus
} from '@/services/supportService';
import { useToast } from '@/contexts/ToastContext';
import { shouldUseWhiteText, darkenColor } from '@/utils/colorContrast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProfile } from '@/services/authService';

const categories = ['Technology', 'Wellness', 'Sports', 'Entrepreneurship', 'Art', 'Science', 'Education', 'Networking'];

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  preferredCategories: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof profileSchema>;

const statusLabels: Record<SupportTicketStatus, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En progreso',
  CLOSED: 'Cerrado'
};

const SettingsPage = () => {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();
  const { logout, user, refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';
  
  // Calcular si usar texto blanco o negro según el color
  const useWhiteText = shouldUseWhiteText(primaryColor);
  const buttonBgColor = theme === 'dark' ? darkenColor(primaryColor, 40) : primaryColor;

  const [asunto, setAsunto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(user?.profilePictureUrl || null);
  
  const {
    register,
    handleSubmit: handleProfileSubmit,
    reset,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      preferredCategories: user?.preferredCategories ?? []
    }
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, preferredCategories: user.preferredCategories || [] });
      setProfilePictureUrl(user.profilePictureUrl || null);
    }
  }, [user, reset]);

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

  const onProfileSubmit = async (values: FormValues) => {
    try {
      await updateProfile({
        ...values,
        profilePictureUrl: profilePictureUrl || undefined
      });
      await refreshProfile();
      pushToast({
        type: 'success',
        title: 'Perfil actualizado',
        description: 'Tus preferencias fueron guardadas exitosamente.'
      });
      reset(values);
    } catch (error: any) {
      pushToast({
        type: 'error',
        title: 'Error al actualizar',
        description: error.message || 'No se pudo actualizar el perfil. Intenta nuevamente.'
      });
    }
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

      {/* Editar Perfil */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900 p-6 shadow-soft space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Editar Perfil</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Actualiza tu información personal y preferencias</p>
        </div>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
          <ImageUpload
            currentImageUrl={user?.profilePictureUrl}
            onImageChange={(url) => setProfilePictureUrl(url)}
            label="Foto de Perfil"
            maxSizeMB={5}
          />
          <TextField
            label="Nombre completo"
            defaultValue={user?.name}
            {...register('name')}
            error={profileErrors.name?.message}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              Categorías Preferidas
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Selecciona las categorías de eventos que más te interesan
            </p>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {categories.map((category) => {
                const selected = user?.preferredCategories?.includes(category) || false;
                return (
                  <label
                    key={category}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={category}
                      defaultChecked={selected}
                      {...register('preferredCategories')}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</span>
                  </label>
                );
              })}
            </div>
            {profileErrors.preferredCategories && (
              <p className="mt-2 text-xs text-error-500">{profileErrors.preferredCategories.message}</p>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                reset();
                setProfilePictureUrl(user?.profilePictureUrl || null);
              }}
              className="btn-secondary flex-1 sm:flex-none"
              disabled={isSubmittingProfile}
            >
              Cancelar
            </button>
            <SubmitButton className="flex-1 sm:flex-none" disabled={isSubmittingProfile}>
              {isSubmittingProfile ? 'Guardando...' : 'Guardar Cambios'}
            </SubmitButton>
          </div>
        </form>
      </div>

      <div className={`grid ${isAdmin ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6`}>
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-6 shadow-soft">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Preferencias generales</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza tu experiencia en UniVibe.</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Tema</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Alterna entre modo claro y oscuro.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      theme === 'light'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Oscuro
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 px-5 py-4">
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Color Personalizado</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Elige el color principal de la aplicación.</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-16 rounded-xl border-2 border-slate-300 dark:border-slate-600 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ 
                        backgroundColor: primaryColor,
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none'
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ 
                        background: `linear-gradient(to bottom right, ${primaryColor}40, ${primaryColor}80)`,
                        border: `2px solid ${primaryColor}`,
                        opacity: 0.3
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex gap-2 flex-wrap">
                      {['#9333EA', '#6366F1', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setPrimaryColor(color)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                            primaryColor === color 
                              ? 'border-slate-900 dark:border-white scale-110 shadow-lg ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900' 
                              : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
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
