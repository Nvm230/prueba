import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import GroupCard from '@/components/display/GroupCard';
import TextField from '@/components/forms/TextField';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { fetchGroups, joinGroup } from '@/services/groupService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';

const GroupsPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);
  const search = params.get('search') ?? undefined;

  const query = usePaginatedQuery({
    queryKey: ['groups', { page, size, search }],
    queryFn: (signal) => fetchGroups({ page, size, search }, signal)
  });

  const groups = query.data?.content ?? [];

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
      await joinGroup(groupId, { userId: user.id });
      pushToast({ type: 'success', title: 'Unido al grupo', description: 'Ahora formas parte de la conversación.' });
      query.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'No se pudo unir', description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Grupos' }]} />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Comunidades activas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Únete a grupos que coinciden con tus intereses.</p>
        </div>
        <div className="w-full max-w-sm">
          <TextField
            label="Buscar grupo"
            placeholder="Nombre del grupo"
            value={search ?? ''}
            onChange={(event) => updateParam('search', event.target.value || undefined)}
          />
        </div>
      </div>
      {query.isLoading ? (
        <LoadingOverlay message="Cargando grupos" />
      ) : groups.length === 0 ? (
        <EmptyState title="Sin grupos" description="Crea un nuevo grupo desde la app móvil o ajusta los filtros." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onJoin={handleJoin} />
          ))}
        </div>
      )}
      {query.data && query.data.totalPages > 1 && (
        <PaginationControls
          page={query.data.page}
          size={query.data.size}
          totalPages={query.data.totalPages}
          totalElements={query.data.totalElements}
          onPageChange={(nextPage) => updateParam('page', nextPage)}
          onSizeChange={(nextSize) => updateParam('size', nextSize)}
        />
      )}
    </div>
  );
};

export default GroupsPage;
