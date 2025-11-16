import apiClient from './apiClient';

export interface GoogleCalendarSyncResponse {
  id: string;
  summary: string;
  htmlLink: string;
  [key: string]: any;
}

export const syncEventToGoogleCalendar = (
  eventId: number,
  signal?: AbortSignal
) =>
  apiClient
    .post<GoogleCalendarSyncResponse>(`/api/integration/googlecalendar/sync/${eventId}`, {}, { signal })
    .then((res) => res.data);

