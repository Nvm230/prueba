export type Role = 'ADMIN' | 'SERVER' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  preferredCategories: string[];
  points: number;
  createdAt: string;
  profilePictureUrl?: string;
  isVisible?: boolean;
}

export type EventStatus = 'PENDING' | 'LIVE' | 'FINISHED';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
}

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
  createdBy?: UserSummary;
  checkInPassword?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  groupRestricted?: boolean;
  maxCapacity?: number | null; // null = sin límite
}

export interface Group {
  id: number;
  name: string;
  owner: UserSummary;
  privacy?: 'PUBLIC' | 'PRIVATE';
  members: UserSummary[];
  pendingJoinRequest?: boolean;
  membersCanChat?: boolean;
}

export interface SurveyAnswer {
  id: number;
  answer: string;
  respondent: User;
}

export interface SurveyQuestion {
  id: number;
  text: string;
  answers?: SurveyAnswer[] | null;
}

export interface Survey {
  id: number;
  title: string;
  event: Event | null;
  questions?: SurveyQuestion[] | null;
  closed?: boolean;
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
  status?: string;
  checkedInAt?: string | null;
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

export interface RegisteredUser {
  id: number;
  name: string;
  email?: string; // Solo para admin/server/creador
  status: string;
  checkedInAt?: string;
}

export interface EventStats {
  totalRegistrations: number;
  checkedInCount: number;
  pendingCheckInCount: number;
  lastCheckInAt?: string;
}

export interface CheckInPasswordResponse {
  password: string;
  qrCodeBase64: string;
}
