import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import { Notification } from '@/types';

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

class NotificationWebSocketService {
  private client: Client | null = null;
  private subscribers: Map<number, (notification: Notification) => void> = new Map();

  connect(userId: number, onNotification: (notification: Notification) => void): () => void {
    try {
      // Si ya hay un subscriber para este usuario, solo agregarlo
      if (this.subscribers.has(userId)) {
        const existingCallback = this.subscribers.get(userId);
        this.subscribers.set(userId, (notif) => {
          existingCallback?.(notif);
          onNotification(notif);
        });
        return () => this.unsubscribe(userId, onNotification);
      }

      // Si no hay cliente conectado, crear uno
      if (!this.client) {
        const token = storage.get(tokenStorageKey);
        this.client = new Client({
          webSocketFactory: () => {
            try {
              return new SockJS(`${WS_BASE_URL}/ws`) as any;
            } catch (error) {
              console.error('[Notification WS] Error creating SockJS:', error);
              throw error;
            }
          },
          connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
          debug: (str) => {
            if (import.meta.env.DEV) {
              console.log('[Notification WS]', str);
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('[Notification WS] Connected');
            this.subscribers.forEach((_, userId) => {
              try {
                this.subscribeToUser(userId);
              } catch (error) {
                console.error(`[Notification WS] Error subscribing to user ${userId}:`, error);
              }
            });
          },
          onStompError: (frame) => {
            console.error('[Notification WS] STOMP error:', frame);
          },
          onWebSocketError: (event) => {
            console.error('[Notification WS] WebSocket error:', event);
          }
        });

        try {
          this.client.activate();
        } catch (error) {
          console.error('[Notification WS] Error activating client:', error);
          this.client = null;
          throw error;
        }
      }

      this.subscribers.set(userId, onNotification);

      // Si el cliente ya está conectado, suscribirse inmediatamente
      if (this.client && this.client.connected) {
        try {
          this.subscribeToUser(userId);
        } catch (error) {
          console.error(`[Notification WS] Error subscribing to user ${userId}:`, error);
        }
      }

      return () => this.unsubscribe(userId, onNotification);
    } catch (error) {
      console.error('[Notification WS] Error in connect:', error);
      // Retornar función vacía para que no falle el cleanup
      return () => {};
    }
  }

  private subscribeToUser(userId: number): void {
    if (!this.client || !this.client.connected) return;

    const destination = `/queue/notifications.${userId}`;
    this.client.subscribe(destination, (message: Message) => {
      try {
        const notification = JSON.parse(message.body) as Notification;
        const callback = this.subscribers.get(userId);
        if (callback) {
          callback(notification);
        }
      } catch (error) {
        console.error('[Notification WS] Error parsing notification:', error);
      }
    });
    console.log(`[Notification WS] Subscribed to ${destination}`);
  }

  private unsubscribe(userId: number, callback: (notification: Notification) => void): void {
    const existing = this.subscribers.get(userId);
    if (existing === callback) {
      this.subscribers.delete(userId);
    } else if (existing) {
      // Si hay múltiples callbacks, crear uno nuevo que excluya este
      this.subscribers.set(userId, (notif) => {
        if (existing !== callback) {
          existing(notif);
        }
      });
    }

    if (this.subscribers.size === 0 && this.client) {
      this.client.deactivate();
      this.client = null;
      console.log('[Notification WS] Disconnected (no subscribers)');
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscribers.clear();
      console.log('[Notification WS] Disconnected');
    }
  }
}

export const notificationWebSocketService = new NotificationWebSocketService();

