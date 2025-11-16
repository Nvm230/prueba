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

export const createGroup = (payload: { name: string }, signal?: AbortSignal) =>
  apiClient
    .post<Group>('/api/groups', null, {
      params: { name: payload.name },
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

// Group Channel Services
export interface GroupMessage {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  content: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
}

export interface GroupAnnouncement {
  id: number;
  title: string;
  content: string;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface GroupEvent {
  id: number;
  event: {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    startTime: string;
    endTime: string;
  };
  sharedBy: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface GroupSurvey {
  id: number;
  survey: {
    id: number;
    title: string;
    event: {
      id: number;
      title: string;
    } | null;
  };
  sharedBy: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export const getGroupMessages = (
  groupId: number,
  filters: { page?: number; size?: number },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<GroupMessage>>(`/api/groups/${groupId}/channel/messages`, {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const createGroupAnnouncement = (
  groupId: number,
  payload: { title: string; content: string },
  signal?: AbortSignal
) =>
  apiClient
    .post(`/api/groups/${groupId}/channel/announcements`, null, {
      params: payload,
      signal
    })
    .then((res) => res.data);

export const getGroupAnnouncements = (
  groupId: number,
  filters: { page?: number; size?: number },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<GroupAnnouncement>>(`/api/groups/${groupId}/channel/announcements`, {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const createGroupEvent = (
  groupId: number,
  payload: {
    title: string;
    category: string;
    description: string;
    faculty?: string;
    career?: string;
    startTime: string;
    endTime: string;
  },
  signal?: AbortSignal
) =>
  apiClient
    .post<{ id: number; eventId: number }>(`/api/groups/${groupId}/channel/events/create`, payload, { signal })
    .then((res) => res.data);

export const shareEventToGroup = (
  groupId: number,
  eventId: number,
  signal?: AbortSignal
) =>
  apiClient
    .post<{ id: number; eventId: number }>(`/api/groups/${groupId}/channel/events/${eventId}/share`, {}, { signal })
    .then((res) => res.data);

export const getGroupEvents = (groupId: number, signal?: AbortSignal) =>
  apiClient.get<GroupEvent[]>(`/api/groups/${groupId}/channel/events`, { signal }).then((res) => res.data);

export const shareSurveyToGroup = (
  groupId: number,
  surveyId: number,
  signal?: AbortSignal
) =>
  apiClient
    .post<{ id: number; surveyId: number }>(`/api/groups/${groupId}/channel/surveys/${surveyId}/share`, {}, { signal })
    .then((res) => res.data);

export const getGroupSurveys = (groupId: number, signal?: AbortSignal) =>
  apiClient.get<GroupSurvey[]>(`/api/groups/${groupId}/channel/surveys`, { signal }).then((res) => res.data);

export const createGroupSurvey = (
  groupId: number,
  payload: { title: string; questions: string[] },
  signal?: AbortSignal
) =>
  apiClient
    .post<{ id: number; surveyId: number }>(`/api/groups/${groupId}/channel/surveys/create`, null, {
      params: {
        title: payload.title,
        questions: payload.questions
      },
      signal
    })
    .then((res) => res.data);
