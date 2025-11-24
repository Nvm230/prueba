import apiClient from './apiClient';
import { PaginatedResponse } from '@/types';

export interface Post {
  id: number;
  content: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  musicUrl?: string;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    profilePictureUrl?: string;
  };
}

export interface CreatePostRequest {
  content: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  musicUrl?: string;
}

export const createPost = (data: CreatePostRequest, signal?: AbortSignal) =>
  apiClient
    .post<Post>('/api/posts', data, { signal })
    .then((res) => res.data);

export const getPosts = (params?: { page?: number; size?: number }, signal?: AbortSignal) =>
  apiClient
    .get<PaginatedResponse<Post>>('/api/posts', {
      params,
      signal
    })
    .then((res) => res.data);

export const toggleLikePost = (postId: number, signal?: AbortSignal) =>
  apiClient
    .post<{ likesCount: number; isLiked: boolean }>(`/api/posts/${postId}/like`, {}, { signal })
    .then((res) => res.data);

export const deletePost = (postId: number, signal?: AbortSignal) =>
  apiClient
    .delete(`/api/posts/${postId}`, { signal })
    .then(() => {});

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    profilePictureUrl?: string;
  };
}

export interface CreateCommentRequest {
  content: string;
}

export const createComment = (postId: number, data: CreateCommentRequest, signal?: AbortSignal) =>
  apiClient
    .post<Comment>(`/api/posts/${postId}/comments`, data, { signal })
    .then((res) => res.data);

export const getComments = (postId: number, params?: { page?: number; size?: number }, signal?: AbortSignal) =>
  apiClient
    .get<PaginatedResponse<Comment>>(`/api/posts/${postId}/comments`, {
      params,
      signal
    })
    .then((res) => res.data);

export const deleteComment = (postId: number, commentId: number, signal?: AbortSignal) =>
  apiClient
    .delete(`/api/posts/${postId}/comments/${commentId}`, { signal })
    .then(() => {});

export const getPostsByUser = (userId: number, params?: { page?: number; size?: number }, signal?: AbortSignal) =>
  apiClient
    .get<PaginatedResponse<Post>>(`/api/posts/user/${userId}`, {
      params,
      signal
    })
    .then((res) => res.data);

