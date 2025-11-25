import api from './api';

export interface Friend {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
    mutualFriends?: number;
}

export interface FriendRequest {
    id: number;
    sender: {
        id: number;
        name: string;
        profilePictureUrl?: string;
    };
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
}

export const friendService = {
    async getFriends(signal?: AbortSignal): Promise<Friend[]> {
        const response = await api.get('/friends', { signal });
        return response.data;
    },

    async getFriendRequests(signal?: AbortSignal): Promise<FriendRequest[]> {
        const response = await api.get('/friends/requests', { signal });
        return response.data;
    },

    async sendFriendRequest(userId: number): Promise<void> {
        await api.post(`/friends/request/${userId}`);
    },

    async acceptFriendRequest(requestId: number): Promise<void> {
        await api.post(`/friends/accept/${requestId}`);
    },

    async rejectFriendRequest(requestId: number): Promise<void> {
        await api.post(`/friends/reject/${requestId}`);
    },

    async removeFriend(friendId: number): Promise<void> {
        await api.delete(`/friends/${friendId}`);
    },

    async searchUsers(query: string, signal?: AbortSignal): Promise<Friend[]> {
        const response = await api.get('/users/search', {
            params: { query },
            signal,
        });
        return response.data;
    },
};
