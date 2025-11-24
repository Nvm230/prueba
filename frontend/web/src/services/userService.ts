import apiClient from './apiClient';
import { PaginatedResponse, Role, User } from '@/types';

export const fetchUsers = (
  filters: { page?: number; size?: number; search?: string },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<User>>('/api/users', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const updateUserRole = (
  userId: number,
  role: Role,
  signal?: AbortSignal
) =>
  apiClient
    .post<User>(`/api/users/${userId}/role`, null, {
      params: { role },
      signal
    })
    .then((res) => res.data);
