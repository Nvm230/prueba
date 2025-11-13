import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import EventCard from '@/components/display/EventCard';
import LoadingOverlay from '@/components/data/LoadingOverlay';
import EmptyState from '@/components/display/EmptyState';
import PaginationControls from '@/components/data/PaginationControls';
import SelectField from '@/components/forms/SelectField';
import TextField from '@/components/forms/TextField';
import { useEvents } from '@/hooks/useEvents';

const EventListPage = () => {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);
  const status = params.get('status') ?? undefined;
  const category = params.get('category') ?? undefined;
  const search = params.get('search') ?? undefined;

  const { events, pageMeta, isLoading } = useEvents({ page, size, status, category, search });

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
    const unique = new Set(events.flatMap((event) => event.category ? [event.category] : []));
    return Array.from(unique);
  }, [events]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', to: '/' }, { label: 'Eventos' }]} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Explorar eventos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Busca por categoría, estado o palabras clave para encontrar el evento perfecto.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField
            label="Estado"
            value={status ?? ''}
            onChange={(event) => updateParam('status', event.target.value || undefined)}
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendiente</option>
            <option value="LIVE">En vivo</option>
            <option value="FINISHED">Finalizado</option>
          </SelectField>
          <SelectField
            label="Categoría"
            value={category ?? ''}
            onChange={(event) => updateParam('category', event.target.value || undefined)}
          >
            <option value="">Todas</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Buscar"
            placeholder="Título o descripción"
            value={search ?? ''}
            onChange={(event) => updateParam('search', event.target.value || undefined)}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingOverlay message="Cargando eventos" />
      ) : events.length === 0 ? (
        <EmptyState title="Sin resultados" description="Prueba con otros filtros o categorías." />
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {pageMeta && pageMeta.totalPages > 1 && (
        <PaginationControls
          page={pageMeta.page}
          size={pageMeta.size}
          totalPages={pageMeta.totalPages}
          totalElements={pageMeta.totalElements}
          onPageChange={(nextPage) => updateParam('page', nextPage)}
          onSizeChange={(nextSize) => updateParam('size', nextSize)}
        />
      )}
    </div>
  );
};

export default EventListPage;
