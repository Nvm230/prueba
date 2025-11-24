import { useSearchParams } from 'react-router-dom';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { fetchUsers, updateUserRole } from '@/services/userService';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import PaginationControls from '@/components/data/PaginationControls';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import SelectField from '@/components/forms/SelectField';
import TextField from '@/components/forms/TextField';

const AdminUsersPage = () => {
  const [params, setParams] = useSearchParams();
  const { pushToast } = useToast();
  const { user: currentUser } = useAuth();

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);
  const search = params.get('search') ?? undefined;

  const query = usePaginatedQuery({
    queryKey: ['users', { page, size, search }],
    queryFn: (signal) => fetchUsers({ page, size, search }, signal)
  });

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

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await updateUserRole(userId, role as any);
      pushToast({ type: 'success', title: 'Rol actualizado', description: 'Los cambios se aplicaron correctamente.' });
      query.refetch();
    } catch (error: any) {
      pushToast({ type: 'error', title: 'No se pudo actualizar', description: error.message });
    }
  };

  const users = query.data?.content ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Administración' }]} />
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-4 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Gestión de usuarios</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Administra roles y accesos del equipo.</p>
          </div>
          <div className="w-full max-w-sm">
            <TextField
              label="Buscar"
              placeholder="Nombre o correo"
              value={search ?? ''}
              onChange={(event) => updateParam('search', event.target.value || undefined)}
            />
          </div>
        </div>
        {query.isLoading ? (
          <LoadingOverlay message="Cargando usuarios" />
        ) : users.length === 0 ? (
          <EmptyState title="Sin usuarios" description="No se encontraron usuarios con los filtros aplicados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Correo</th>
                  <th className="px-4 py-2">Rol</th>
                  <th className="px-4 py-2">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{user.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <SelectField
                        label=""
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                        disabled={currentUser?.id === user.id && currentUser?.role === 'ADMIN' && user.role === 'ADMIN'}
                      >
                        <option value="USER">USER</option>
                        <option value="SERVER">SERVER</option>
                        <option value="ADMIN">ADMIN</option>
                      </SelectField>
                      {currentUser?.id === user.id && currentUser?.role === 'ADMIN' && user.role === 'ADMIN' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          No puedes modificar tu propio rol
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{user.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
};

export default AdminUsersPage;
