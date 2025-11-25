import apiClient from './api';

export interface Story {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profilePictureUrl?: string;
    };
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    musicUrl?: string;
    createdAt: string;
    expiresAt: string;
    viewCount: number;
    hasViewed: boolean;
}

export interface CreateStoryRequest {
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    musicUrl?: string;
}

export const storyService = {
    async getAll(signal?: AbortSignal): Promise<Story[]> {
        const response = await apiClient.get('/stories', { signal });
        return response.data;
    },

    async create(data: CreateStoryRequest): Promise<Story> {
        const response = await apiClient.post('/stories', data);
        return response.data;
    },

    async markAsViewed(storyId: number): Promise<void> {
        await apiClient.post(`/stories/${storyId}/view`);
    },

    async delete(storyId: number): Promise<void> {
        await apiClient.delete(`/stories/${storyId}`);
    },
};
