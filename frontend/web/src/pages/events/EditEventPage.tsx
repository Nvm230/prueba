import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import TextField from '@/components/forms/TextField';
import SelectField from '@/components/forms/SelectField';
import SubmitButton from '@/components/forms/SubmitButton';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import { fetchEventDetail, updateEvent } from '@/services/eventService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { PencilIcon } from '@heroicons/react/24/outline';

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200, 'El título es demasiado largo'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000, 'La descripción es demasiado larga'),
  faculty: z.string().optional(),
  career: z.string().optional(),
  startTime: z.string().min(1, 'La fecha de inicio es requerida'),
  endTime: z.string().min(1, 'La fecha de fin es requerida'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC')
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'La fecha de fin debe ser posterior a la fecha de inicio',
  path: ['endTime']
});

type EventFormValues = z.infer<typeof eventSchema>;

const categories = [
  'Technology',
  'Wellness',
  'Sports',
  'Entrepreneurship',
  'Art',
  'Science',
  'Education',
  'Networking',
  'Workshop',
  'Conference'
];

const EditEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();

  const {
    data: event,
    isLoading: isLoadingEvent,
    isError: isErrorEvent
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: ({ signal }) => fetchEventDetail(Number(eventId), signal),
    enabled: Boolean(eventId)
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: '',
      visibility: 'PUBLIC'
    }
  });

  // Cargar datos del evento cuando esté disponible
  React.useEffect(() => {
    if (event) {
      const startTime = new Date(event.startTime).toISOString().slice(0, 16);
      const endTime = new Date(event.endTime).toISOString().slice(0, 16);
      reset({
        title: event.title,
        category: event.category,
        description: event.description,
        faculty: event.faculty || '',
        career: event.career || '',
        startTime: startTime,
        endTime: endTime,
        visibility: event.visibility
      });
    }
  }, [event, reset]);

  const mutation = useMutation({
    mutationFn: (data: EventFormValues) => updateEvent(Number(eventId!), data),
    onSuccess: (updatedEvent) => {
      pushToast({
        type: 'success',
        title: 'Evento actualizado',
        description: 'El evento ha sido actualizado exitosamente.'
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      navigate(`/events/${updatedEvent.id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'No se pudo actualizar el evento. Intenta nuevamente.';
      pushToast({
        type: 'error',
        title: 'Error al actualizar evento',
        description: errorMessage
      });
      console.error('Error updating event:', error);
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      faculty: data.faculty || null,
      career: data.career || null,
      visibility: data.visibility
    };
    mutation.mutate(payload);
  };

  if (isLoadingEvent) {
    return <LoadingOverlay message="Cargando evento" />;
  }

  if (isErrorEvent || !event) {
    return <EmptyState title="Evento no encontrado" description="Verifica el enlace e intenta nuevamente." />;
  }

  // Verificar permisos
  const isCreator = event.createdBy?.id === user?.id;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isAdmin || isCreator;

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: event.title, to: `/events/${eventId}` }, { label: 'Editar' }]} />
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Acceso Restringido
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Solo el creador del evento o un administrador pueden editarlo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: event.title, to: `/events/${eventId}` }, { label: 'Editar' }]} />
      
      <div className="card max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <PencilIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Editar Evento</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Modifica la información del evento
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <TextField
                label="Título del Evento"
                placeholder="Ej: Taller de Programación Web"
                {...register('title')}
                error={errors.title?.message}
                required
              />
            </div>

            <SelectField
              label="Categoría"
              {...register('category')}
              error={errors.category?.message}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </SelectField>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Descripción <span className="text-error-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={5}
                className="input-field"
                placeholder="Describe el evento, sus objetivos y qué aprenderán los participantes..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-500">{errors.description.message}</p>
              )}
            </div>

            <TextField
              label="Facultad"
              placeholder="Ej: Facultad de Ingeniería"
              {...register('faculty')}
              error={errors.faculty?.message}
            />

            <TextField
              label="Carrera"
              placeholder="Ej: Ingeniería en Informática"
              {...register('career')}
              error={errors.career?.message}
            />

            <div>
              <TextField
                label="Fecha y Hora de Inicio"
                type="datetime-local"
                {...register('startTime')}
                error={errors.startTime?.message}
                required
              />
            </div>

            <div>
              <TextField
                label="Fecha y Hora de Fin"
                type="datetime-local"
                {...register('endTime')}
                error={errors.endTime?.message}
                required
              />
            </div>

            <SelectField
              label="Visibilidad"
              {...register('visibility')}
              error={errors.visibility?.message}
              className="md:col-span-2"
            >
              <option value="PUBLIC">Público</option>
              <option value="PRIVATE">Privado</option>
            </SelectField>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}`)}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Cancelar
            </button>
            <SubmitButton
              className="flex-1 sm:flex-none"
              disabled={isSubmitting || mutation.isLoading}
            >
              {mutation.isLoading ? 'Actualizando...' : 'Actualizar Evento'}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;

