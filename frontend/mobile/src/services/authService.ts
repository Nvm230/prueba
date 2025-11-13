import apiClient from './apiClient';
import { AuthResponse, User } from '@/types';

export const login = (email: string, password: string, signal?: AbortSignal) =>
  apiClient.post<AuthResponse>('/api/auth/login', { email, password }, { signal }).then((res) => res.data);

export const register = (payload: { name: string; email: string; password: string }, signal?: AbortSignal) =>
  apiClient.post<AuthResponse>('/api/auth/register', payload, { signal }).then((res) => res.data);

export const fetchProfile = (signal?: AbortSignal) =>
  apiClient.get<User>('/api/users/me', { signal }).then((res) => res.data);
