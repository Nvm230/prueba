import apiClient from './apiClient';

export interface Story {
  id: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  musicUrl?: string;
  caption?: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    profilePictureUrl?: string;
  };
}

export interface CreateStoryRequest {
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  musicUrl?: string;
  caption?: string;
}

export const createStory = (data: CreateStoryRequest, signal?: AbortSignal) =>
  apiClient
    .post<Story>('/api/stories', data, { signal })
    .then((res) => res.data);

export const getMyStories = (signal?: AbortSignal) =>
  apiClient
    .get<Story[]>('/api/stories/my', { signal })
    .then((res) => res.data);

export const getAllStories = (signal?: AbortSignal) =>
  apiClient
    .get<Story[]>('/api/stories', { signal })
    .then((res) => res.data);

export const deleteStory = (storyId: number, signal?: AbortSignal) =>
  apiClient
    .delete(`/api/stories/${storyId}`, { signal })
    .then(() => {});

