import apiClient from './apiClient';
import { Event, PaginatedResponse, RegistrationResponse } from '@/types';

export const fetchEvents = (
  filters: { page?: number; size?: number; status?: string; search?: string },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<Event>>('/api/events', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const fetchEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.get<Event>(`/api/events/${eventId}`, { signal }).then((res) => res.data);

export const registerForEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.post<RegistrationResponse>(`/api/registrations/events/${eventId}`, null, { signal }).then((res) => res.data);
