export type Role = 'ADMIN' | 'SERVER' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  preferredCategories: string[];
  points: number;
  createdAt: string;
}

export type EventStatus = 'PENDING' | 'LIVE' | 'FINISHED';

export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  faculty?: string;
  career?: string;
  status: EventStatus;
  startTime: string;
  endTime: string;
  tags: string[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface AuthResponse {
  token: string;
}

export interface RegistrationResponse {
  registrationId: number;
  qrBase64: string;
}
