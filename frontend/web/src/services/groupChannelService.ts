import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import { GroupMessage } from './groupService';

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

export interface GroupMessageRequest {
  content: string;
  fileId?: number;
  fileType?: string;
  fileName?: string;
  stickerId?: number;
}

class GroupChannelService {
  private clients: Map<number, Client> = new Map();

  connect(groupId: number, onMessage: (message: GroupMessage) => void, onError?: (error: any) => void): () => void {
    if (this.clients.has(groupId)) {
      return () => this.disconnect(groupId);
    }

    const token = storage.get(tokenStorageKey);
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`) as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP-GROUP]', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log(`[Group Channel] Connected for group ${groupId}`);
        client.subscribe(`/topic/groups.${groupId}`, (message: Message) => {
          try {
            const groupMessage = JSON.parse(message.body) as GroupMessage;
            onMessage(groupMessage);
          } catch (error) {
            console.error('[Group Channel] Error parsing message:', error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[Group Channel] STOMP error:', frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error('[Group Channel] WebSocket error:', event);
        onError?.(event);
      }
    });

    client.activate();
    this.clients.set(groupId, client);

    return () => this.disconnect(groupId);
  }

  sendMessage(groupId: number, message: GroupMessageRequest): void {
    const client = this.clients.get(groupId);
    if (client && client.connected) {
      client.publish({
        destination: `/app/group.${groupId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Group Channel] Cannot send message: client not connected`);
    }
  }

  disconnect(groupId: number): void {
    const client = this.clients.get(groupId);
    if (client) {
      client.deactivate();
      this.clients.delete(groupId);
      console.log(`[Group Channel] Disconnected for group ${groupId}`);
    }
  }

  disconnectAll(): void {
    this.clients.forEach((client, groupId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}

export const groupChannelService = new GroupChannelService();







