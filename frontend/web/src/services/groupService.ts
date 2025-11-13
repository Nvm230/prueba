import apiClient from './apiClient';
import { Group, PaginatedResponse } from '@/types';

export const fetchGroups = (
  filters: { page?: number; size?: number; search?: string },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<Group>>('/api/groups', {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const fetchGroupDetail = (groupId: number, signal?: AbortSignal) =>
  apiClient.get<Group>(`/api/groups/${groupId}`, { signal }).then((res) => res.data);

export const createGroup = (payload: { name: string; ownerId: number }, signal?: AbortSignal) =>
  apiClient
    .post<Group>('/api/groups', null, {
      params: payload,
      signal
    })
    .then((res) => res.data);

export const joinGroup = (
  groupId: number,
  payload: { userId: number },
  signal?: AbortSignal
) =>
  apiClient
    .post(`/api/groups/${groupId}/join`, null, {
      params: payload,
      signal
    })
    .then((res) => res.data as { members: number });
