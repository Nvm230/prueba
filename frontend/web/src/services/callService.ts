import SockJS from 'sockjs-client';
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
  // SockJS necesita http:// o https://, no ws:// o wss://
  if (typeof window === 'undefined') {
    return 'http://localhost:8080';
  }

  // En desarrollo (Vite en puerto 5173), conectar directamente al backend
  const isDev = window.location.hostname === 'localhost' && window.location.port === '5173';
  if (isDev) {
    return 'http://localhost:8080';
  }

  // En producción o con Nginx, usar window.location.origin para que Nginx haga el proxy
  return window.location.origin;
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
  from?: number;
  to?: number;
  userId?: number | string;
  payload?: any;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  room?: string;
}

class CallSignalingService {
  private ws: WebSocket | null = null;
  private sessionId: number | null = null;
  private userId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number | null = null;

  connect(
    sessionId: number,
    userId: number,
    onMessage: (signal: CallSignal) => void,
    onConnected?: () => void,
    onError?: (error: any) => void
  ) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.sessionId = sessionId;
    this.userId = userId;
    this.reconnectAttempts = 0;

    // Usar SockJS para compatibilidad con el backend
    const wsUrl = `${WS_BASE_URL}/call-signal`;
    if (import.meta.env.DEV) {
      console.log('[CALL] Connecting to WebSocket:', wsUrl);
    }

    try {
      // Usar SockJS ya que el backend está configurado con .withSockJS()
      this.ws = new SockJS(wsUrl) as any;

      this.ws.onopen = () => {
        if (import.meta.env.DEV) {
          console.log('[CALL] WebSocket connected');
        }
        this.reconnectAttempts = 0;
        // Esperar a que el WebSocket esté completamente listo antes de enviar
        const checkAndSend = () => {
          const isOpen = (this.ws as any)?.readyState === WebSocket.OPEN || (this.ws as any)?.readyState === 1;
          if (isOpen) {
            this.send({
              type: 'join',
              userId: userId.toString()
            });
            onConnected?.();
          } else {
            // Reintentar después de un breve delay
            setTimeout(checkAndSend, 50);
          }
        };
        // Dar un pequeño delay para asegurar que el WebSocket esté completamente abierto
        setTimeout(checkAndSend, 100);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (import.meta.env.DEV) {
            console.log('[CALL] Received message:', data.type, data);
          }
          if (data.type === 'error') {
            console.error('[CALL] Server error:', data.message);
            onError?.(new Error(data.message));
            return;
          }
          onMessage(data);
        } catch (error) {
          console.error('[CALL] Error parsing message:', error, 'Data:', event.data?.substring(0, 100));
        }
      };

      this.ws.onerror = (error) => {
        console.error('[CALL] WebSocket error:', error);
        onError?.(error);
      };

      this.ws.onclose = (event) => {
        if (import.meta.env.DEV) {
          console.log('[CALL] WebSocket closed:', event.code, event.reason);
        }
        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
          if (import.meta.env.DEV) {
            console.log(`[CALL] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          }
          this.reconnectTimeout = window.setTimeout(() => {
            if (this.sessionId && this.userId) {
              this.connect(this.sessionId, this.userId, onMessage, onConnected, onError);
            }
          }, delay);
        }
      };
    } catch (error) {
      console.error('[CALL] Error creating WebSocket:', error);
      onError?.(error);
    }
  }

  send(signal: CallSignal) {
    if (!this.ws || !this.sessionId) {
      console.warn('[CALL] Cannot send signal, WebSocket not connected');
      return;
    }

    // SockJS usa readyState 1 para OPEN
    const isOpen = (this.ws as any).readyState === WebSocket.OPEN || (this.ws as any).readyState === 1;
    if (!isOpen) {
      console.warn('[CALL] Cannot send signal, WebSocket not open, state:', (this.ws as any).readyState);
      return;
    }

    const message = {
      room: this.sessionId.toString(),
      ...signal
    };

    if (import.meta.env.DEV) {
      console.log('[CALL] Sending message:', message.type, message);
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('[CALL] Error sending signal:', error);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      try {
        (this.ws as any).close();
      } catch (e) {
        // Ignorar errores al cerrar
      }
      this.ws = null;
    }
    this.sessionId = null;
    this.userId = null;
    this.reconnectAttempts = 0;
  }
}

export const callSignalingService = new CallSignalingService();

