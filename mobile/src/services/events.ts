import apiClient from './api';

export interface Event {
    id: number;
    title: string;
    category: string;
    description: string;
    faculty?: string;
    career?: string;
    startTime: string;
    endTime: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    imageUrl?: string;
    organizerId: number;
    maxCapacity?: number;
    currentAttendees?: number;
    attendeeCount?: number;
    status?: string;
}

export interface CreateEventRequest {
    title: string;
    category: string;
    description: string;
    faculty?: string;
    career?: string;
    startTime: string;
    endTime: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    maxCapacity?: number;
}

export const eventService = {
    async getAll(): Promise<Event[]> {
        const response = await apiClient.get('/events');
        return response.data;
    },

    async getById(id: number, signal?: AbortSignal): Promise<Event> {
        const response = await apiClient.get(`/events/${id}`, { signal });
        return response.data;
    },

    async create(data: CreateEventRequest): Promise<Event> {
        const response = await apiClient.post('/events', data);
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
