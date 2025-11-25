import apiClient from './api';

export interface Post {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profilePictureUrl?: string;
    };
    content: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    musicUrl?: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
}

export interface Comment {
    id: number;
    user: {
        id: number;
        name: string;
        profilePictureUrl?: string;
    };
    content: string;
    createdAt: string;
}

export interface CreatePostRequest {
    content: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    musicUrl?: string;
}

export interface CreateCommentRequest {
    content: string;
}

export const postService = {
    async getAll(params: { page?: number; size?: number }, signal?: AbortSignal): Promise<{ content: Post[]; totalPages: number; totalElements: number }> {
        const response = await apiClient.get('/posts', {
            params: { page: params.page || 0, size: params.size || 10 },
            signal
        });
        return response.data;
    },

    async create(data: CreatePostRequest): Promise<Post> {
        const response = await apiClient.post('/posts', data);
        return response.data;
    },

    async toggleLike(postId: number): Promise<void> {
        await apiClient.post(`/posts/${postId}/like`);
    },

    async delete(postId: number): Promise<void> {
        await apiClient.delete(`/posts/${postId}`);
    },

    async getComments(postId: number, signal?: AbortSignal): Promise<Comment[]> {
        const response = await apiClient.get(`/posts/${postId}/comments`, { signal });
        return response.data;
    },

    async createComment(postId: number, data: CreateCommentRequest): Promise<Comment> {
        const response = await apiClient.post(`/posts/${postId}/comments`, data);
        return response.data;
    },

    async deleteComment(postId: number, commentId: number): Promise<void> {
        await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    },
};
