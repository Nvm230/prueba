import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import GroupCard from '@/components/display/GroupCard';
import TextField from '@/components/forms/TextField';
import SubmitButton from '@/components/forms/SubmitButton';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { fetchGroups, joinGroup, createGroup } from '@/services/groupService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const groupSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre es demasiado largo'),
  privacy: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC')
});

type GroupFormValues = z.infer<typeof groupSchema>;

const GroupsPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);
  const searchParam = params.get('search') ?? '';
  const debouncedSearch = useDebouncedValue(searchParam, 500);

  const query = usePaginatedQuery({
    queryKey: ['groups', { page, size, search: debouncedSearch }],
    queryFn: (signal) => fetchGroups({ page, size, search: debouncedSearch }, signal)
  });

  const createMutation = useMutation({
    mutationFn: (data: GroupFormValues) => createGroup(data),
    onSuccess: () => {
      pushToast({ type: 'success', title: 'Grupo creado', description: 'El grupo ha sido creado exitosamente.' });
      setShowCreateForm(false);
      reset();
      query.refetch();
    },
    onError: (error: any) => {
      pushToast({ type: 'error', title: 'Error al crear grupo', description: error.message || 'No se pudo crear el grupo' });
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { privacy: 'PUBLIC' }
  });

  const groups = query.data?.content ?? [];
  const canCreateGroups = user && (user.role === 'ADMIN' || user.role === 'SERVER');

  const updateParam = (key: string, value?: string | number) => {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') {
      next.set('page', '0');
    }
    setParams(next, { replace: true });
  };

  const handleJoin = async (groupId: number) => {
    if (!user) return;
    try {
      const response = await joinGroup(groupId, user.id);
      if (response.status === 'JOINED') {
        pushToast({ type: 'success', title: 'Unido al grupo', description: 'Ahora formas parte de la conversación.' });
        query.refetch();
      } else if (response.status === 'PENDING') {
        pushToast({
          type: 'info',
          title: 'Solicitud enviada',
          description: response.message || 'El creador debe aprobar tu ingreso.'
        });
      } else {
        pushToast({
          type: 'info',
          title: 'Ya eres miembro',
          description: response.message || 'Ya formas parte de este grupo.'
        });
      }
    } catch (error: any) {
      pushToast({ type: 'error', title: 'No se pudo unir', description: error.message });
    }
  };

  const onSubmit = (data: GroupFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Grupos' }]} />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Comunidades Activas</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Únete a grupos que coinciden con tus intereses o crea uno nuevo
          </p>
        </div>
        <div className="flex gap-3">
          <div className="w-full max-w-sm">
            <TextField
              label="Buscar grupo"
              placeholder="Nombre del grupo"
              value={searchParam}
              onChange={(event) => updateParam('search', event.target.value || undefined)}
            />
          </div>
          {canCreateGroups && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary whitespace-nowrap inline-flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Grupo
            </button>
          )}
        </div>
      </div>

      {/* Formulario de creación */}
      {showCreateForm && canCreateGroups && (
        <div className="card border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/70">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Crear Nuevo Grupo</h3>
              <TextField
                label="Nombre del Grupo"
                placeholder="Ej: Estudiantes de Ingeniería"
                {...register('name')}
                error={errors.name?.message}
                required
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                  Privacidad
                </label>
                <select
                  {...register('privacy')}
                  className="input"
                >
                  <option value="PUBLIC">Público (cualquiera puede unirse)</option>
                  <option value="PRIVATE">Privado (requiere aprobación)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <SubmitButton disabled={createMutation.isLoading} className="flex-1 sm:flex-none">
                {createMutation.isLoading ? 'Creando...' : 'Crear Grupo'}
              </SubmitButton>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  reset();
                }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {query.isLoading ? (
        <LoadingOverlay message="Cargando grupos" />
      ) : groups.length === 0 ? (
        <EmptyState
          title="Sin grupos"
          description={
            canCreateGroups
              ? 'Crea tu primer grupo para comenzar a organizar comunidades.'
              : 'Aún no hay grupos disponibles. Contacta a un administrador para crear uno.'
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} onJoin={handleJoin} />
            ))}
          </div>
          {query.data && query.data.totalPages > 1 && (
            <div className="card">
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
        </>
      )}
    </div>
  );
};

export default GroupsPage;
