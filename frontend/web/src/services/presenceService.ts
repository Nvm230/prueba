import apiClient from './apiClient';
import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';

const getWsBaseUrl = (): string => {
  // Detectar si estamos en producción (AWS) basándose en la URL actual
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  // En producción, usar la URL base del sitio actual (Nginx hace proxy de /ws al backend)
  if (isProduction) {
    const baseUrl = window.location.origin;
    console.log('[WS] Production detected, using window.location.origin:', baseUrl);
    return baseUrl;
  }
  
  // En desarrollo, usar la variable de entorno o localhost como fallback
  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== '') {
    // Asegurarse de que no use ws:// o wss:// (SockJS necesita http:// o https://)
    const normalizedUrl = envUrl.replace(/^wss?:\/\//, envUrl.startsWith('wss://') ? 'https://' : 'http://');
    console.log('[WS] Using WS_BASE_URL from env:', normalizedUrl);
    return normalizedUrl;
  }
  
  console.warn('[WS] VITE_WS_BASE_URL not found, using default:', 'http://localhost:8080');
  return 'http://localhost:8080';
};

const WS_BASE_URL = getWsBaseUrl();
console.log('[WS] Final WS_BASE_URL:', WS_BASE_URL);

export interface PresenceUpdate {
  userId: number;
  online: boolean;
}

class PresenceService {
  private client: Client | null = null;
  private subscribers: Set<(update: PresenceUpdate) => void> = new Set();
  private onlineUsers: Set<number> = new Set();

  connect(onPresenceUpdate: (update: PresenceUpdate) => void): () => void {
    if (this.client) {
      this.subscribers.add(onPresenceUpdate);
      return () => this.subscribers.delete(onPresenceUpdate);
    }

    const token = storage.get(tokenStorageKey);
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`) as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP-PRESENCE]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[Presence] Connected');
        this.client?.subscribe('/topic/presence', (message: Message) => {
          try {
            const update = JSON.parse(message.body) as PresenceUpdate;
            if (update.online) {
              this.onlineUsers.add(update.userId);
            } else {
              this.onlineUsers.delete(update.userId);
            }
            this.subscribers.forEach((callback) => callback(update));
          } catch (error) {
            console.error('[Presence] Error parsing update:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[Presence] STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('[Presence] WebSocket error:', event);
      }
    });

    this.subscribers.add(onPresenceUpdate);
    this.client.activate();

    return () => {
      this.subscribers.delete(onPresenceUpdate);
      if (this.subscribers.size === 0) {
        this.disconnect();
      }
    };
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscribers.clear();
      this.onlineUsers.clear();
      console.log('[Presence] Disconnected');
    }
  }

  isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }

  async checkPresence(userId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<{ userId: number; online: boolean }>(`/api/presence/user/${userId}`);
      if (response.data.online) {
        this.onlineUsers.add(userId);
      } else {
        this.onlineUsers.delete(userId);
      }
      return response.data.online;
    } catch (error) {
      console.error('[Presence] Error checking presence:', error);
      return false;
    }
  }
}

export const presenceService = new PresenceService();
