import apiClient from './apiClient';
import { Event, PaginatedResponse } from '@/types';

export type EventFilters = {
  page?: number;
  size?: number;
  status?: string;
  category?: string;
  search?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
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

export const updateEvent = (eventId: number, payload: Partial<Event>, signal?: AbortSignal) =>
  apiClient.put<Event>(`/api/events/${eventId}`, payload, { signal }).then((res) => res.data);

export const deleteEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.delete(`/api/events/${eventId}`, { signal }).then((res) => res.data);

export const fetchEventRegistrations = (eventId: number, signal?: AbortSignal) =>
  apiClient.get(`/api/events/${eventId}/registrations`, { signal }).then((res) => res.data);

export const fetchEventStats = (eventId: number, signal?: AbortSignal) =>
  apiClient.get(`/api/events/${eventId}/stats`, { signal }).then((res) => res.data);

export const fetchCheckInPassword = (eventId: number, signal?: AbortSignal) =>
  apiClient.get(`/api/events/${eventId}/check-in-password`, { signal }).then((res) => res.data);

export const fetchEventRegistrationQr = (eventId: number, signal?: AbortSignal) =>
  apiClient.get<{ eventId: number; qrBase64: string; payload: string }>(`/api/registrations/events/${eventId}/qr`, { 
    signal,
    headers: {
      'Accept': 'application/json'
    }
  }).then((res) => res.data);
