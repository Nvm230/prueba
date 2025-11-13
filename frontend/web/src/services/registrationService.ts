import apiClient from './apiClient';
import { RegistrationResponse } from '@/types';

export const registerForEvent = (eventId: number, signal?: AbortSignal) =>
  apiClient.post<RegistrationResponse>(`/api/registrations/${eventId}`, null, { signal }).then((res) => res.data);
