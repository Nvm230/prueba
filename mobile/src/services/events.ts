import apiClient from './api';

export interface Event {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl?: string;
    organizerId: number;
    maxCapacity?: number;
    currentAttendees?: number;
}

export const eventService = {
    async getAll(): Promise<Event[]> {
        const response = await apiClient.get('/events');
        return response.data;
    },

    async getById(id: number): Promise<Event> {
        const response = await apiClient.get(`/events/${id}`);
        return response.data;
    },

    async register(eventId: number): Promise<void> {
        await apiClient.post(`/events/${eventId}/register`);
    },

    async checkIn(eventId: number, qrCode: string): Promise<void> {
        await apiClient.post(`/events/${eventId}/checkin`, { qrCode });
    },

    async getMyEvents(): Promise<Event[]> {
        const response = await apiClient.get('/events/my-events');
        return response.data;
    },
};
