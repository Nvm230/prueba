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
  category: string;
  description: string;
  faculty: string | null;
  career: string | null;
  status: EventStatus;
  startTime: string;
  endTime: string;
  tags: string[];
}

export interface Group {
  id: number;
  name: string;
  owner: User;
  members: User[];
}

export interface SurveyAnswer {
  id: number;
  answer: string;
  respondent: User;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  answers: SurveyAnswer[];
}

export interface Survey {
  id: number;
  title: string;
  event: Event;
  questions: SurveyQuestion[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  readFlag: boolean;
  createdAt: string;
}

export interface Registration {
  id: number;
  event: Event;
  status: string;
  checkedInAt?: string;
}

export interface RegistrationResponse {
  registrationId: number;
  qrBase64: string;
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
