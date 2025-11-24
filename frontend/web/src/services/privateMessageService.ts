import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import { PrivateMessage } from './socialService';

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

export interface PrivateMessageRequest {
  content: string;
  fileId?: number;
  fileType?: string;
  fileName?: string;
  stickerId?: number;
  callMode?: string;
}

class PrivateMessageService {
  private clients: Map<number, Client> = new Map();

  connect(userId: number, onMessage: (message: PrivateMessage) => void, onError?: (error: any) => void): () => void {
    if (this.clients.has(userId)) {
      return () => this.disconnect(userId);
    }

    const token = storage.get(tokenStorageKey);
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`) as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP-PRIVATE]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log(`[Private Message] Connected for user ${userId}`);
        client.subscribe(`/queue/private.${userId}`, (message: Message) => {
          try {
            const privateMessage = JSON.parse(message.body) as PrivateMessage;
            onMessage(privateMessage);
          } catch (error) {
            console.error('[Private Message] Error parsing message:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[Private Message] STOMP error:', frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error('[Private Message] WebSocket error:', event);
        onError?.(event);
      }
    });

    client.activate();
    this.clients.set(userId, client);

    return () => this.disconnect(userId);
  }

  sendMessage(receiverId: number, message: PrivateMessageRequest): void {
    const client = Array.from(this.clients.values())[0]; // Usar cualquier cliente conectado
    if (client && client.connected) {
      client.publish({
        destination: `/app/private.${receiverId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Private Message] Cannot send message: client not connected`);
    }
  }

  disconnect(userId: number): void {
    const client = this.clients.get(userId);
    if (client) {
      client.deactivate();
      this.clients.delete(userId);
      console.log(`[Private Message] Disconnected for user ${userId}`);
    }
  }

  disconnectAll(): void {
    this.clients.forEach((client, userId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}

export const privateMessageService = new PrivateMessageService();







