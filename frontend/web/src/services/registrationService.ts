import apiClient from './apiClient';
import { RegistrationResponse, Event } from '@/types';

export const getUserRegistrations = (signal?: AbortSignal) =>
  apiClient
    .get<{ content: Event[] }>('/api/events/registered', { signal })
    .then((res) => res.data.content);

export const getRegistration = (eventId: number, signal?: AbortSignal) =>
  apiClient.get<RegistrationResponse>(`/api/registrations/events/${eventId}`, { signal })
    .then((res) => res.data)
    .catch((error) => {
      if (error.response?.status === 404) {
        return null; // No está registrado
      }
      throw error;
    });

export const registerForEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.post<RegistrationResponse>(`/api/registrations/events/${eventId}`, null, { signal }).then((res) => res.data);

export const scanEventQr = (qrPayload: string, signal?: AbortSignal) =>
  apiClient.post<RegistrationResponse>('/api/registrations/scan', { qrPayload }, { signal }).then((res) => res.data);
