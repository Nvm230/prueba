import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import apiClient from './apiClient';
import { PaginatedResponse } from '@/types';
import { ReactionSummary } from '@/types/reaction';

const getWsBaseUrl = (): string => {
  // Detectar si estamos en producción (AWS) basándose en la URL actual
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  // En producción, usar la URL base del sitio actual (Nginx hace proxy de /ws al backend)
  if (isProduction) {
    const baseUrl = window.location.origin;
    return baseUrl;
  }
  
  // En desarrollo, usar la variable de entorno o localhost como fallback
  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== '') {
    // Asegurarse de que no use ws:// o wss:// (SockJS necesita http:// o https://)
    const normalizedUrl = envUrl.replace(/^wss?:\/\//, envUrl.startsWith('wss://') ? 'https://' : 'http://');
    return normalizedUrl;
  }
  
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
  fileId?: number;
  filePreview?: string;
  stickerId?: number;
  stickerPreview?: string;
  reactions?: ReactionSummary[];
  createdAt: string;
}

export interface ChatMessageRequest {
  content: string;
  fileId?: number;
  fileType?: string;
  fileName?: string;
  stickerId?: number;
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
