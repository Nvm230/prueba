import apiClient from './api';

export interface Group {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    memberCount: number;
    isPublic: boolean;
    isMember: boolean;
    creatorId: number;
}

export interface GroupMember {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profilePictureUrl?: string;
    };
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER';
    joinedAt: string;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
    imageUrl?: string;
    isPublic: boolean;
}

export const groupService = {
    async getAll(signal?: AbortSignal): Promise<Group[]> {
        const response = await apiClient.get('/groups', { signal });
        return response.data;
    },

    async getById(id: number, signal?: AbortSignal): Promise<Group> {
        const response = await apiClient.get(`/groups/${id}`, { signal });
        return response.data;
    },

    async create(data: CreateGroupRequest): Promise<Group> {
        const response = await apiClient.post('/groups', data);
        return response.data;
    },

    async join(groupId: number): Promise<void> {
        await apiClient.post(`/groups/${groupId}/join`);
    },

    async leave(groupId: number): Promise<void> {
        await apiClient.post(`/groups/${groupId}/leave`);
    },

    async getMembers(groupId: number, signal?: AbortSignal): Promise<GroupMember[]> {
        const response = await apiClient.get(`/groups/${groupId}/members`, { signal });
        return response.data;
    },

    async delete(groupId: number): Promise<void> {
        await apiClient.delete(`/groups/${groupId}`);
    },
};
