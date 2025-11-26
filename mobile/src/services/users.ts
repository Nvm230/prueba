import apiClient from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
    bio?: string;
    createdAt: string;
}

export interface UserStats {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    eventsCount: number;
}

export interface UpdateProfileRequest {
    name?: string;
    bio?: string;
    profilePictureUrl?: string;
}

export const userService = {
    async getMe(): Promise<User> {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    async getById(userId: number): Promise<User> {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        const response = await apiClient.put('/users/me', data);
        return response.data;
    },

    async getStats(userId?: number): Promise<UserStats> {
        // If backend doesn't have this endpoint, we'll aggregate from other endpoints
        try {
            const endpoint = userId ? `/users/${userId}/stats` : '/users/me/stats';
            const response = await apiClient.get(endpoint);
            return response.data;
        } catch (error) {
            // Fallback: aggregate stats from different endpoints
            const [postsResponse, friendsResponse] = await Promise.all([
                apiClient.get(userId ? `/posts/user/${userId}` : '/posts').catch(() => ({ data: { totalElements: 0 } })),
                apiClient.get('/friends').catch(() => ({ data: [] })),
            ]);

            return {
                postsCount: postsResponse.data.totalElements || postsResponse.data.length || 0,
                followersCount: 0, // Would need friends endpoint with followers
                followingCount: Array.isArray(friendsResponse.data) ? friendsResponse.data.length : 0,
                eventsCount: 0, // Would need events endpoint
            };
        }
    },
};
