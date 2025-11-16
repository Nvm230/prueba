import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import apiClient from './apiClient';
import { PaginatedResponse } from '@/types';

// Obtener la URL base de WebSocket desde variables de entorno
// En Docker local: http://localhost:8080 (backend expuesto en puerto 8080)
// En desarrollo local: http://localhost:8080
// En producción AWS: configurar VITE_WS_BASE_URL con la URL pública del backend
const getWsBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== '') {
    return envUrl;
  }
  // Por defecto, usar localhost:8080 (funciona en desarrollo y Docker local)
  return 'http://localhost:8080';
};

const WS_BASE_URL = getWsBaseUrl();

export interface ChatMessage {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
  };
  content: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
  createdAt: string;
}

export interface ChatMessageRequest {
  content: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
}

class ChatService {
  private clients: Map<number, Client> = new Map();

  connect(eventId: number, onMessage: (message: ChatMessage) => void, onError?: (error: any) => void): () => void {
    if (this.clients.has(eventId)) {
      return () => this.disconnect(eventId);
    }

    const token = storage.get(tokenStorageKey);
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`) as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log(`[Chat] Connected to event ${eventId}`);
        client.subscribe(`/topic/events.${eventId}`, (message: Message) => {
          try {
            const chatMessage = JSON.parse(message.body) as ChatMessage;
            onMessage(chatMessage);
          } catch (error) {
            console.error('[Chat] Error parsing message:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[Chat] STOMP error:', frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error('[Chat] WebSocket error:', event);
        onError?.(event);
      }
    });

    client.activate();
    this.clients.set(eventId, client);

    return () => this.disconnect(eventId);
  }

  sendMessage(eventId: number, message: ChatMessageRequest): void {
    const client = this.clients.get(eventId);
    if (client && client.connected) {
      client.publish({
        destination: `/app/chat.${eventId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Chat] Cannot send message: client not connected for event ${eventId}`);
    }
  }

  disconnect(eventId: number): void {
    const client = this.clients.get(eventId);
    if (client) {
      client.deactivate();
      this.clients.delete(eventId);
      console.log(`[Chat] Disconnected from event ${eventId}`);
    }
  }

  disconnectAll(): void {
    this.clients.forEach((client, eventId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}

export const chatService = new ChatService();

// Servicio REST para obtener mensajes guardados
export const fetchChatMessages = (
  eventId: number,
  filters: { page?: number; size?: number },
  signal?: AbortSignal
) =>
  apiClient
    .get<PaginatedResponse<ChatMessage>>(`/api/chat/events/${eventId}/messages`, {
      params: filters,
      signal
    })
    .then((res) => res.data);
