import apiClient from './apiClient';

export interface CheckInRequest {
  payload: string;
}

export interface CheckInResponse {
  status: string;
  checkedInAt: string;
}

export const checkInWithQR = (payload: string, signal?: AbortSignal) =>
  apiClient
    .post<CheckInResponse>('/api/registrations/check-in', { payload }, { signal })
    .then((res) => res.data);







