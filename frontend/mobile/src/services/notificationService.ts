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
