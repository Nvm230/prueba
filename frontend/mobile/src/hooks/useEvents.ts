import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '@/services/eventService';
import { PaginatedResponse, Event } from '@/types';

export const useEvents = (filters: { page?: number; size?: number; status?: string; search?: string }) =>
  useQuery<PaginatedResponse<Event>>({
    queryKey: ['events', filters],
    queryFn: ({ signal }) => fetchEvents(filters, signal)
  });
