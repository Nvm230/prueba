import apiClient from './apiClient';
import { Notification, PaginatedResponse } from '@/types';

export const fetchNotifications = (
  userId: number,
  filters: { page?: number; size?: number },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<Notification>>(`/api/notifications/${userId}`, {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const sendNotification = (
  userId: number,
  payload: { title: string; message: string; sendEmail?: boolean },
  signal?: AbortSignal
) =>
  apiClient
    .post<Notification>(`/api/notifications/${userId}`, null, {
      params: {
        ...payload,
        sendEmail: payload.sendEmail ?? false
      },
      signal
    })
    .then((res) => res.data);

export const markNotificationAsRead = (notificationId: number, signal?: AbortSignal) =>
  apiClient.put(`/api/notifications/${notificationId}/read`, null, { signal }).then((res) => res.data);

export const markMessageNotificationsAsRead = (senderName: string, signal?: AbortSignal) =>
  apiClient.put(`/api/notifications/mark-message-notifications-read/${encodeURIComponent(senderName)}`, null, { signal }).then((res) => res.data);
