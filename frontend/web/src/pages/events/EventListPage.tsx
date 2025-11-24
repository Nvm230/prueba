import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import EventCard from '@/components/display/EventCard';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import SelectField from '@/components/forms/SelectField';
import TextField from '@/components/forms/TextField';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { getUserRegistrations } from '@/services/registrationService';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, TicketIcon, StarIcon } from '@heroicons/react/24/outline';

const EventListPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const [showRegistered, setShowRegistered] = useState(false);

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 12);
  const status = params.get('status') ?? undefined;
  const category = params.get('category') ?? undefined;
  const searchParam = params.get('search') ?? '';
  const debouncedSearch = useDebouncedValue(searchParam, 500);

  const { events, pageMeta, isLoading } = useEvents({
    page,
    size,
    status,
    category,
    search: debouncedSearch || undefined
  });

  // Obtener eventos recomendados basados en preferencias
  const { data: recommendedEventsData } = useQuery({
    queryKey: ['events', 'recommended', user?.id],
    queryFn: ({ signal }) => {
      // Usar useEvents hook internamente o hacer query directa
      return Promise.resolve([]);
    },
    enabled: Boolean(user && user.preferredCategories && user.preferredCategories.length > 0)
  });

  const recommendedEvents = useMemo(() => {
    if (!user || !user.preferredCategories || user.preferredCategories.length === 0) {
      return [];
    }
    
    // Filtrar eventos actuales que coincidan con preferencias
    return events
      .filter((event) => user.preferredCategories?.includes(event.category))
      .slice(0, 6); // Mostrar máximo 6 recomendados
  }, [events, user]);

  const { data: registeredEvents = [], isLoading: loadingRegistered } = useQuery({
    queryKey: ['user-registrations', user?.id],
    queryFn: ({ signal }) => getUserRegistrations(signal),
    enabled: Boolean(user) && showRegistered
  });

  const updateParam = (key: string, value?: string | number) => {
    const next = new URLSearchParams(params);
    if (value === undefined || value === '') {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== 'page') {
      next.set('page', '0');
    }
    setParams(next, { replace: true });
  };

  const categories = useMemo(() => {
    const unique = new Set(events.flatMap((event) => (event.category ? [event.category] : [])));
    return Array.from(unique).sort();
  }, [events]);

  const canCreateEvents = user && (user.role === 'ADMIN' || user.role === 'SERVER');

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Eventos' }]} />
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Explorar Eventos</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Descubre y regístrate en eventos universitarios que te interesen
          </p>
        </div>
        <div className="flex gap-2">
          {user && (
            <button
              onClick={() => setShowRegistered(!showRegistered)}
              className={`btn-secondary inline-flex items-center gap-2 whitespace-nowrap ${
                showRegistered ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''
              }`}
            >
              <TicketIcon className="h-5 w-5" />
              {showRegistered ? 'Ver todos' : 'Mis inscripciones'}
            </button>
          )}
          {canCreateEvents && (
            <Link
              to="/events/new"
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Crear Evento
            </Link>
          )}
        </div>
      </div>

      {/* Mis Inscripciones */}
      {showRegistered && user && (
        <div className="card border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/70">
          <div className="flex items-center gap-2 mb-4">
            <TicketIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Mis Eventos Inscritos</h2>
          </div>
          {loadingRegistered ? (
            <LoadingOverlay message="Cargando tus inscripciones" />
          ) : registeredEvents.length === 0 ? (
            <EmptyState
              title="Sin inscripciones"
              description="Aún no te has inscrito a ningún evento. Explora los eventos disponibles y regístrate."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Events */}
      {!showRegistered && recommendedEvents.length > 0 && (
        <div className="card border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/70">
          <div className="flex items-center gap-2 mb-4">
            <StarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recomendaciones para ti</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Basado en tus preferencias: {user?.preferredCategories?.join(', ')}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filtros de Búsqueda</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
              Buscar
            </label>
            <TextField
              placeholder="Título o descripción..."
              value={searchParam}
              onChange={(event) => updateParam('search', event.target.value || undefined)}
            />
          </div>
          <SelectField
            label="Estado"
            value={status ?? ''}
            onChange={(event) => updateParam('status', event.target.value || undefined)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="LIVE">En vivo</option>
            <option value="FINISHED">Finalizado</option>
          </SelectField>
          <SelectField
            label="Categoría"
            value={category ?? ''}
            onChange={(event) => updateParam('category', event.target.value || undefined)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
        </div>
        {(status || category || searchParam) && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setParams({});
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingOverlay message="Cargando eventos" />
      ) : events.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description={
            searchParam || status || category
              ? 'No se encontraron eventos con los filtros seleccionados. Prueba con otros criterios.'
              : 'Aún no hay eventos disponibles. Vuelve más tarde.'
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Mostrando {events.length} de {pageMeta?.totalElements ?? 0} eventos
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pageMeta && pageMeta.totalPages > 1 && (
        <div className="card">
          <PaginationControls
            page={pageMeta.page}
            size={pageMeta.size}
            totalPages={pageMeta.totalPages}
            totalElements={pageMeta.totalElements}
            onPageChange={(nextPage) => updateParam('page', nextPage)}
            onSizeChange={(nextSize) => updateParam('size', nextSize)}
          />
        </div>
      )}
    </div>
  );
};

export default EventListPage;
