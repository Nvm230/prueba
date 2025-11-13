import apiClient from './apiClient';
import { Event, PaginatedResponse } from '@/types';

export type EventFilters = {
  page?: number;
  size?: number;
  status?: string;
  category?: string;
  search?: string;
};

export const fetchEvents = (filters: EventFilters, signal?: AbortSignal) =>
  apiClient
    .get<PaginatedResponse<Event>>('/api/events', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const fetchEventDetail = (eventId: number, signal?: AbortSignal) =>
  apiClient.get<Event>(`/api/events/${eventId}`, { signal }).then((res) => res.data);

export const createEvent = (payload: Partial<Event>, signal?: AbortSignal) =>
  apiClient.post<Event>('/api/events', payload, { signal }).then((res) => res.data);

export const startEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.post<Event>(`/api/events/${eventId}/start`, null, { signal }).then((res) => res.data);

export const finishEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.post<Event>(`/api/events/${eventId}/finish`, null, { signal }).then((res) => res.data);
