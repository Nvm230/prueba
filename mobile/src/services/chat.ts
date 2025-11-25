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

export interface Conversation {
    userId: number;
    userName: string;
    userPhoto?: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export const chatService = {
    async getConversations(): Promise<Conversation[]> {
        const response = await apiClient.get('/messages/conversations');
        return response.data;
    },

    async getMessages(userId: number): Promise<Message[]> {
        const response = await apiClient.get(`/messages/with/${userId}`);
        return response.data;
    },

    async sendMessage(receiverId: number, content: string): Promise<Message> {
        const response = await apiClient.post('/messages', {
            receiverId,
            content,
        });
        return response.data;
    },

    async markAsRead(messageId: number): Promise<void> {
        await apiClient.put(`/messages/${messageId}/read`);
    },

    // Alias for compatibility
    getChats: function () {
        return this.getConversations();
    },
};
