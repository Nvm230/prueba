import apiClient from './apiClient';

export interface CheckInRequest {
  payload?: string; // Para check-in con QR
  eventId?: number; // Para check-in con contraseña
  password?: string; // Para check-in con contraseña
}

export interface CheckInResponse {
  status: string;
  checkedInAt: string;
}

export const checkInWithQR = (payload: string, signal?: AbortSignal) =>
  apiClient
    .post<CheckInResponse>('/api/registrations/check-in', { payload }, { signal })
    .then((res) => res.data);

export const checkInWithPassword = (eventId: number, password: string, signal?: AbortSignal) =>
  apiClient
    .post<CheckInResponse>('/api/registrations/check-in', { eventId, password }, { signal })
    .then((res) => res.data);







