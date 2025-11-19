import apiClient from './apiClient';
import { Group, PaginatedResponse } from '@/types';
import { ReactionSummary } from '@/types/reaction';

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

export const createGroup = (payload: { name: string; privacy?: 'PUBLIC' | 'PRIVATE' }, signal?: AbortSignal) =>
  apiClient
    .post<Group>('/api/groups', null, {
      params: { name: payload.name, privacy: payload.privacy ?? 'PUBLIC' },
      signal
    })
    .then((res) => res.data);

export interface JoinGroupResponse {
  status: 'JOINED' | 'PENDING' | 'ALREADY_MEMBER';
  message?: string;
  group?: Group;
}

export const joinGroup = (groupId: number, userId?: number, signal?: AbortSignal) =>
  apiClient
    .post<JoinGroupResponse>(`/api/groups/${groupId}/join`, null, {
      params: userId ? { userId } : undefined,
      signal
    })
    .then((res) => res.data);

export const deleteGroup = (groupId: number, signal?: AbortSignal) =>
  apiClient.delete(`/api/groups/${groupId}`, { signal }).then((res) => res.data);

export const toggleGroupChat = (groupId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ membersCanChat: boolean; message: string }>(`/api/groups/${groupId}/toggle-chat`, {}, { signal })
    .then((res) => res.data);

export interface GroupJoinRequest {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const fetchGroupJoinRequests = (groupId: number, signal?: AbortSignal) =>
  apiClient.get<GroupJoinRequest[]>(`/api/groups/${groupId}/join-requests`, { signal }).then((res) => res.data);

export const approveJoinRequest = (groupId: number, requestId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ status: 'APPROVED'; group: Group }>(`/api/groups/${groupId}/join-requests/${requestId}/approve`, null, { signal })
    .then((res) => res.data);

export const rejectJoinRequest = (groupId: number, requestId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ status: 'REJECTED' }>(`/api/groups/${groupId}/join-requests/${requestId}/reject`, null, { signal })
    .then((res) => res.data);

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
  fileId?: number;
  filePreview?: string;
  stickerId?: number;
  stickerPreview?: string;
  createdAt: string;
  reactions?: ReactionSummary[];
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
    visibility: 'PUBLIC' | 'PRIVATE';
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
