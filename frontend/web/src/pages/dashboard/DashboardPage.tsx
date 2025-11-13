import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import StatCard from '@/components/display/StatCard';
import EventCard from '@/components/display/EventCard';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '@/services/notificationService';
import { timeAgo } from '@/utils/formatters';

const DashboardPage = () => {
  const { user } = useAuth();
  const { events, isLoading: loadingEvents } = useEvents({ page: 0, size: 4, status: 'PENDING' });
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ['notifications', user?.id, { page: 0, size: 5 }],
    queryFn: ({ signal }) => fetchNotifications(user!.id, { page: 0, size: 5 }, signal),
    enabled: Boolean(user)
  });

  if (!user) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Hola, {user.name}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Aquí tienes un resumen de tu participación en eventos y las últimas novedades.
        </p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Eventos registrados" value={user.points} trend="Tus puntos actuales" />
        <StatCard title="Roles" value={user.role} accent="success" />
        <StatCard title="Preferencias" value={user.preferredCategories.length} accent="warning" />
        <StatCard
          title="Último acceso"
          value={timeAgo(user.createdAt)}
          trend="Desde que te uniste"
          accent="primary"
        />
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Próximos eventos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mantente al día con lo que viene.</p>
          </div>
          {loadingEvents ? (
            <LoadingOverlay message="Cargando eventos" />
          ) : events.length === 0 ? (
            <EmptyState
              title="Sin eventos próximos"
              description="Regístrate en nuevos eventos desde la pestaña de eventos."
            />
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notificaciones recientes</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Actualizaciones personalizadas para ti.</p>
          </div>
          {loadingNotifications ? (
            <LoadingOverlay message="Cargando notificaciones" />
          ) : notifications && notifications.content.length > 0 ? (
            <ul className="space-y-3">
              {notifications.content.map((notification) => (
                <li
                  key={notification.id}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                  <span className="text-xs text-slate-400">{timeAgo(notification.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Sin notificaciones"
              description="Cuando recibas nuevas alertas aparecerán aquí."
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
