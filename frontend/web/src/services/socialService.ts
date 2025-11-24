import apiClient from './apiClient';
import { PaginatedResponse } from '@/types';
import { ReactionSummary } from '@/types/reaction';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  points: number;
  qrCodeBase64: string;
  profilePictureUrl?: string;
  totalLikes?: number;
}

export interface FriendRequest {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  createdAt: string;
}

export interface Friend {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  points: number;
}

export interface Conversation {
  userId: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  unreadCount: number;
}

export interface PrivateMessage {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  receiver: {
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
  readFlag: boolean;
  createdAt: string;
  callMode?: string;
  reactions?: ReactionSummary[];
}

export const getMyProfile = (signal?: AbortSignal) =>
  apiClient.get<UserProfile>('/api/social/profile/me', { signal }).then((res) => res.data);

export const getUserProfile = (userId: number, signal?: AbortSignal) =>
  apiClient.get<UserProfile>(`/api/social/profile/${userId}`, { signal }).then((res) => res.data);

export const searchUsers = (email: string, signal?: AbortSignal) =>
  apiClient
    .get<Array<{ id: number; name: string; email: string; profilePictureUrl?: string }>>('/api/social/search', {
      params: { email },
      signal
    })
    .then((res) => res.data);

export const scanQr = (qrData: string, signal?: AbortSignal) =>
  apiClient
    .post<{ id: number; name: string; email: string; profilePictureUrl?: string }>('/api/social/scan-qr', { qrData }, { signal })
    .then((res) => res.data);

export const sendFriendRequest = (receiverId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ id: number; status: string }>('/api/friends/request', null, {
      params: { receiverId },
      signal
    })
    .then((res) => res.data);

export const getFriendRequests = (signal?: AbortSignal) =>
  apiClient.get<FriendRequest[]>('/api/friends/requests', { signal }).then((res) => res.data);

export const acceptFriendRequest = (requestId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ id: number; status: string }>(`/api/friends/requests/${requestId}/accept`, {}, { signal })
    .then((res) => res.data);

export const rejectFriendRequest = (requestId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ id: number; status: string }>(`/api/friends/requests/${requestId}/reject`, {}, { signal })
    .then((res) => res.data);

export const getFriends = (signal?: AbortSignal) =>
  apiClient.get<Friend[]>('/api/friends', { signal }).then((res) => res.data);

export const getFriendRecommendations = (signal?: AbortSignal) =>
  apiClient.get<Friend[]>('/api/friends/recommendations', { signal }).then((res) => res.data);

export const getConversations = (signal?: AbortSignal) =>
  apiClient.get<Conversation[]>('/api/private-messages/conversations', { signal }).then((res) => res.data);

export const getConversation = (
  otherUserId: number,
  filters: { page?: number; size?: number },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<PrivateMessage>>(`/api/private-messages/conversation/${otherUserId}`, {
      params: filters,
      signal
    })
    .then((res) => res.data);

export const getUnreadMessageCount = (signal?: AbortSignal) =>
  apiClient.get<{ count: number }>('/api/private-messages/unread-count', { signal }).then((res) => res.data);

export const markConversationAsRead = (otherUserId: number, signal?: AbortSignal) =>
  apiClient.post<{ success: boolean; markedCount: number }>(`/api/private-messages/conversation/${otherUserId}/mark-read`, {}, { signal }).then((res) => res.data);







