import apiClient from './apiClient';

export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface SupportUserInfo {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
}

export interface SupportMessage {
  id: number;
  sender: SupportUserInfo;
  contenido: string;
  createdAt: string;
}

export interface SupportTicket {
  id: number;
  asunto: string;
  categoria?: string;
  estado: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  solicitante: SupportUserInfo;
  mensajes: SupportMessage[];
}

export interface SupportTicketRequest {
  asunto: string;
  categoria?: string;
  mensaje: string;
}

export const createSupportTicket = async (payload: SupportTicketRequest) => {
  const { data } = await apiClient.post<SupportTicket>('/api/support/tickets', payload);
  return data;
};

export const getMySupportTickets = async () => {
  const { data } = await apiClient.get<SupportTicket[]>('/api/support/tickets/my');
  return data;
};

export const getAllSupportTickets = async () => {
  const { data } = await apiClient.get<SupportTicket[]>('/api/support/tickets');
  return data;
};

export const getSupportTicket = async (ticketId: number) => {
  const { data } = await apiClient.get<SupportTicket>(`/api/support/tickets/${ticketId}`);
  return data;
};

export const replySupportTicket = async (ticketId: number, mensaje: string) => {
  const { data } = await apiClient.post<SupportMessage>(`/api/support/tickets/${ticketId}/reply`, { mensaje });
  return data;
};

export const updateSupportTicketStatus = async (ticketId: number, estado: SupportTicketStatus) => {
  const { data } = await apiClient.post<SupportTicket>(`/api/support/tickets/${ticketId}/status`, { estado });
  return data;
};























