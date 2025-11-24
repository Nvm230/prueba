import apiClient from './api';

export interface Post {
    id: number;
    content: string;
    mediaUrl?: string;
    musicUrl?: string;
    user: {
        id: number;
        name: string;
        photoUrl?: string;
    };
    likedBy: number[];
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
    };
    createdAt: string;
}

export const socialService = {
    async getPosts(): Promise<Post[]> {
        const response = await apiClient.get('/posts');
        return response.data;
    },

    async createPost(content: string, mediaUrl?: string, musicUrl?: string): Promise<Post> {
        const response = await apiClient.post('/posts', { content, mediaUrl, musicUrl });
        return response.data;
    },

    async likePost(postId: number): Promise<void> {
        await apiClient.post(`/posts/${postId}/like`);
    },

    async commentPost(postId: number, content: string): Promise<Comment> {
        const response = await apiClient.post(`/posts/${postId}/comments`, { content });
        return response.data;
    },

    async getStories(): Promise<any[]> {
        const response = await apiClient.get('/stories');
        return response.data;
    },

    async getFriends(): Promise<any[]> {
        const response = await apiClient.get('/friends');
        return response.data;
    },
};
