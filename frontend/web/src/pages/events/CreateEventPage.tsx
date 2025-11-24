import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import TextField from '@/components/forms/TextField';
import SelectField from '@/components/forms/SelectField';
import SubmitButton from '@/components/forms/SubmitButton';
import { createEvent } from '@/services/eventService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { PlusIcon } from '@heroicons/react/24/outline';

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200, 'El título es demasiado largo'),
  category: z.string().min(1, 'Selecciona una categoría'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000, 'La descripción es demasiado larga'),
  faculty: z.string().optional(),
  career: z.string().optional(),
  startTime: z.string().min(1, 'La fecha de inicio es requerida'),
  endTime: z.string().min(1, 'La fecha de fin es requerida'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
  maxCapacity: z.union([z.number().positive('El aforo debe ser mayor a 0'), z.null()]).optional()
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

const CreateEventPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [hasMaxCapacity, setHasMaxCapacity] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      category: '',
      visibility: 'PUBLIC'
    }
  });

  const mutation = useMutation({
    mutationFn: (data: EventFormValues) => createEvent(data),
    onSuccess: (event) => {
      pushToast({
        type: 'success',
        title: 'Evento creado',
        description: 'El evento ha sido creado exitosamente.'
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(`/events/${event.id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'No se pudo crear el evento. Intenta nuevamente.';
      pushToast({
        type: 'error',
        title: 'Error al crear evento',
        description: errorMessage
      });
      console.error('Error creating event:', error);
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      faculty: data.faculty || null,
      career: data.career || null,
      visibility: data.visibility,
      maxCapacity: hasMaxCapacity && data.maxCapacity ? data.maxCapacity : null
    };
    mutation.mutate(payload);
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SERVER')) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: 'Crear Evento' }]} />
        <div className="card text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Acceso Restringido
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Solo los administradores y servidores pueden crear eventos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Eventos', to: '/events' }, { label: 'Crear Evento' }]} />
      
      <div className="card max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <PlusIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Nuevo Evento</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Completa el formulario para crear un nuevo evento universitario
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
              <option value="PUBLIC">Público (aparece en Eventos)</option>
              <option value="PRIVATE">Privado (solo accesible con enlace o grupo)</option>
            </SelectField>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Aforo Máximo
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  id="hasMaxCapacity"
                  checked={hasMaxCapacity}
                  onChange={(e) => {
                    setHasMaxCapacity(e.target.checked);
                    if (!e.target.checked) {
                      // Limpiar el valor cuando se desmarca
                      const input = document.getElementById('maxCapacityInput') as HTMLInputElement;
                      if (input) input.value = '';
                    }
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="hasMaxCapacity" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  Establecer límite de aforo
                </label>
              </div>
              {hasMaxCapacity && (
                <TextField
                  id="maxCapacityInput"
                  type="number"
                  min="1"
                  placeholder="Ej: 50"
                  {...register('maxCapacity', { valueAsNumber: true })}
                  error={errors.maxCapacity?.message}
                />
              )}
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {hasMaxCapacity ? 'Establece el número máximo de participantes permitidos' : 'Deja sin marcar para permitir inscripciones ilimitadas'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Los eventos privados no se listan en la sección general y solo los miembros de los grupos con los que lo compartas podrán inscribirse.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Cancelar
            </button>
            <SubmitButton
              className="flex-1 sm:flex-none"
              disabled={isSubmitting || mutation.isLoading}
            >
              {mutation.isLoading ? 'Creando...' : 'Crear Evento'}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;

