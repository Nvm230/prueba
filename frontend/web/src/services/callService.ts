import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import apiClient from './apiClient';
import { storage, tokenStorageKey } from '@/utils/storage';

export type CallContextType = 'PRIVATE' | 'GROUP' | 'EVENT';
export type CallMode = 'NORMAL' | 'CONFERENCE';

export interface CallSession {
  id: number;
  contextType: CallContextType;
  contextId: number;
  mode: CallMode;
  activo: boolean;
  createdAt: string;
  acceptedAt?: string | null;
  endedAt?: string | null;
  durationSeconds?: number | null;
  missed?: boolean;
  createdById: number;
}

const getWsBaseUrl = (): string => {
  const isProduction =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    return window.location.origin;
  }

  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== '') {
    return envUrl.replace(/^wss?:\/\//, envUrl.startsWith('wss://') ? 'https://' : 'http://');
  }
  return 'http://localhost:8080';
};

const WS_BASE_URL = getWsBaseUrl();

export const createCallSession = async (payload: { contextType: CallContextType; contextId: number; mode: CallMode }) => {
  const { data } = await apiClient.post<CallSession>('/api/calls', payload);
  return data;
};

export const getActiveCall = async (contextType: CallContextType, contextId: number) => {
  const response = await apiClient.get<CallSession>('/api/calls/active', {
    params: { contextType, contextId },
    validateStatus: (status) => status === 200 || status === 204
  });
  if (response.status === 204) {
    return null;
  }
  return response.data;
};

export const endCallSession = async (sessionId: number) => {
  await apiClient.post(`/api/calls/${sessionId}/end`, {});
};

export const acceptCallSession = async (sessionId: number) => {
  const { data } = await apiClient.post<CallSession>(`/api/calls/${sessionId}/accept`, {});
  return data;
};

export interface CallSignal {
  type: string;
  from: number;
  to?: number;
  payload?: any;
}

class CallSignalingService {
  private client: Client | null = null;

  connect(
    sessionId: number,
    onMessage: (signal: CallSignal) => void,
    onConnected?: () => void,
    onError?: (error: any) => void
  ) {
    if (this.client && this.client.connected) {
      this.disconnect();
    }

    const token = storage.get(tokenStorageKey);
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`) as any,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: import.meta.env.DEV ? (str) => console.log('[CALL]', str) : undefined,
      reconnectDelay: 5000,
      onConnect: () => {
        this.client?.subscribe(`/topic/call.${sessionId}`, (message: Message) => {
          try {
            const body = message.body;
            if (!body || body.trim() === '') {
              return;
            }
            const signal = JSON.parse(body) as CallSignal;
            if (signal && signal.type) {
              onMessage(signal);
            }
          } catch (error) {
            console.error('[CALL] Error parsing call signal', error, 'Body:', message.body?.substring(0, 100));
          }
        });
        onConnected?.();
      },
      onStompError: (frame) => {
        console.error('[CALL] STOMP error:', frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error('[CALL] WebSocket error:', event);
        onError?.(event);
      }
    });

    this.client.activate();
  }

  send(sessionId: number, signal: CallSignal) {
    if (!this.client || !this.client.connected) {
      return;
    }
    this.client.publish({
      destination: `/app/call.${sessionId}`,
      body: JSON.stringify(signal)
    });
  }

  disconnect() {
    this.client?.deactivate();
    this.client = null;
  }
}

export const callSignalingService = new CallSignalingService();

