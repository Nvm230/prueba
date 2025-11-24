import { useState, useMemo } from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import EventCard from '@/components/display/EventCard';
import EventCalendar from '@/components/display/EventCalendar';
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
  SparklesIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Obtener todos los eventos para el calendario
  const { events: allEvents, isLoading: loadingAllEvents } = useEvents({ page: 0, size: 100, status: 'PENDING' });
  
  // Filtrar eventos según la fecha seleccionada
  const filteredEvents = useMemo(() => {
    if (!selectedDate) {
      return allEvents.slice(0, 4); // Mostrar primeros 4 si no hay fecha seleccionada
    }
    
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    
    return allEvents
      .filter(event => {
        const eventDate = new Date(event.startTime);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= selectedDateStart;
      })
      .slice(0, 4);
  }, [allEvents, selectedDate]);
  
  const loadingEvents = loadingAllEvents;
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
      <div className="card bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 border-primary-400 dark:border-primary-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-white">
                ¡Hola, {user.name}! 👋
              </h1>
              <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <p className="text-sm font-semibold text-white">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <p className="text-base text-white/90 max-w-2xl">
              Bienvenido a UniVibe. Aquí tienes un resumen de tu participación en eventos y las últimas novedades.
            </p>
          </div>
          <div className="hidden md:block p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <EventCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            events={allEvents}
          />
        </div>

        {/* Upcoming Events */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <CalendarDaysIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedDate 
                    ? `Eventos desde ${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`
                    : 'Próximos Eventos'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedDate ? 'Eventos para la fecha seleccionada y posteriores' : 'Mantente al día con lo que viene'}
                </p>
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
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              title={selectedDate ? "Sin eventos para esta fecha" : "Sin eventos próximos"}
              description={selectedDate ? "No hay eventos programados para esta fecha o posteriores." : "Regístrate en nuevos eventos desde la pestaña de eventos."}
            />
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Notifications Section */}
      <section className="grid gap-6 lg:grid-cols-1">
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
