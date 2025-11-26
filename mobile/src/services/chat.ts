import apiClient from './api';

export interface Message {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    sender: {
        id: number;
        name: string;
        photoUrl?: string;
    };
    createdAt: string;
    read: boolean;
}

export interface Chat {
    id: number;
    otherUser: {
        id: number;
        name: string;
        email: string;
        profilePictureUrl?: string;
    };
    lastMessage?: {
        content: string;
        createdAt: string;
    };
    unreadCount: number;
    createdAt: string;
}

export const chatService = {
    async getConversations(): Promise<Chat[]> {
        const response = await apiClient.get('/private-messages/conversations');
        // Transform backend response to match Chat interface
        return response.data.map((conv: any) => ({
            id: conv.userId, // Using userId as conversation id
            otherUser: {
                id: conv.userId,
                name: conv.name,
                email: conv.email,
                profilePictureUrl: conv.profilePictureUrl,
            },
            unreadCount: conv.unreadCount || 0,
            createdAt: new Date().toISOString(), // Backend doesn't return this
        }));
    },

    async getMessages(userId: number): Promise<Message[]> {
        const response = await apiClient.get(`/private-messages/conversation/${userId}`);
        return response.data.content || response.data;
    },

    async sendMessage(receiverId: number, content: string): Promise<Message> {
        // Note: Backend uses WebSocket for sending, this is a fallback
        const response = await apiClient.post('/private-messages', {
            receiverId,
            content,
        });
        return response.data;
    },

    async markAsRead(otherUserId: number): Promise<void> {
        await apiClient.post(`/private-messages/conversation/${otherUserId}/mark-read`);
    },

    // Alias for compatibility
    getChats: function () {
        return this.getConversations();
    },
};
