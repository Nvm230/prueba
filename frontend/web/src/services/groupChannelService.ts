import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { storage, tokenStorageKey } from '@/utils/storage';
import { GroupMessage } from './groupService';

const getWsBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== '') {
    return envUrl;
  }
  return 'http://localhost:8080';
};

const WS_BASE_URL = getWsBaseUrl();

export interface GroupMessageRequest {
  content: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
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







