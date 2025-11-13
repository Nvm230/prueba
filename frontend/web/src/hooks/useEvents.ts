import { useMemo } from 'react';
import { fetchEvents, EventFilters } from '@/services/eventService';
import { PaginatedResponse, Event } from '@/types';
import { usePaginatedQuery } from './usePaginatedQuery';

export const useEvents = (filters: EventFilters) => {
  const query = usePaginatedQuery<PaginatedResponse<Event>>({
    queryKey: ['events', filters],
    queryFn: (signal) => fetchEvents(filters, signal)
  });

  return useMemo(() => ({
    ...query,
    events: query.data?.content ?? [],
    pageMeta: query.data
  }), [query]);
};
