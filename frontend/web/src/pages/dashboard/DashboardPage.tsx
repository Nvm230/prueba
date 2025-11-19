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
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  BellAlertIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();
  const { events, isLoading: loadingEvents } = useEvents({ page: 0, size: 4, status: 'PENDING' });
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ['notifications', user?.id, { page: 0, size: 5 }],
    queryFn: ({ signal }) => fetchNotifications(user!.id, { page: 0, size: 5 }, signal),
    enabled: Boolean(user),
    refetchInterval: 5000 // Actualizar cada 5 segundos para reflejar cambios
  });

  // Filtrar solo notificaciones no leídas para mostrar en "Notificaciones Recientes"
  const unreadNotifications = notifications?.content?.filter(n => !n.readFlag) || [];

  if (!user) {
    return <LoadingOverlay message="Cargando perfil" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio' }]} />
      
      {/* Welcome Section */}
      <div className="card bg-gradient-to-br from-primary-50 via-primary-100/50 to-purple-50 dark:from-primary-900/20 dark:via-primary-800/10 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              ¡Hola, {user.name}! 👋
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              Bienvenido a UniVibe. Aquí tienes un resumen de tu participación en eventos y las últimas novedades.
            </p>
          </div>
          <div className="hidden md:block p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60">
            <SparklesIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Puntos Gamificados"
          value={user.points || 0}
          trend="Sigue participando para ganar más"
          accent="primary"
          icon={<TrophyIcon className="h-6 w-6" />}
        />
        <StatCard
          title="Rol"
          value={user.role}
          accent="success"
        />
        <StatCard
          title="Categorías Preferidas"
          value={user.preferredCategories?.length || 0}
          accent="warning"
        />
        <StatCard
          title="Miembro desde"
          value={timeAgo(user.createdAt)}
          trend="Desde que te uniste"
          accent="primary"
        />
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <CalendarDaysIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Próximos Eventos</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Mantente al día con lo que viene</p>
              </div>
            </div>
            <Link
              to="/events"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {loadingEvents ? (
            <LoadingOverlay message="Cargando eventos" />
          ) : events.length === 0 ? (
            <EmptyState
              title="Sin eventos próximos"
              description="Regístrate en nuevos eventos desde la pestaña de eventos."
            />
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
                <BellAlertIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notificaciones Recientes</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Actualizaciones personalizadas para ti</p>
              </div>
            </div>
            <Link
              to="/notifications"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Ver todas
            </Link>
          </div>
          {loadingNotifications ? (
            <LoadingOverlay message="Cargando notificaciones" />
          ) : unreadNotifications.length > 0 ? (
            <ul className="space-y-3">
              {unreadNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 glass p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                        {notification.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.readFlag && (
                      <span className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 block">
                    {timeAgo(notification.createdAt)}
                  </span>
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
