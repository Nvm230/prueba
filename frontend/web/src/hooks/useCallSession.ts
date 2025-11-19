import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { CallSession, callSignalingService, CallSignal } from '@/services/callService';
import { useAuth } from './useAuth';

interface UseCallSessionOptions {
  session: CallSession | null;
  onEnded?: () => void;
}

interface RemoteStream {
  userId: number;
  stream: MediaStream;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
];

export const useCallSession = ({ session, onEnded }: UseCallSessionOptions) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const peersRef = useRef<Record<number, SimplePeer.Instance>>({});
  const allowBroadcast = session && user ? (session.mode === 'NORMAL' || session.createdById === user.id) : false;
  const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    let mounted = true;

    const requestStream = async (): Promise<MediaStream | null> => {
      const constraints: Array<MediaStreamConstraints> = [
        { audio: true, video: true },
        { audio: true, video: false },
        { audio: false, video: true }
      ];
      for (const constraint of constraints) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraint);
          if (constraint.audio && constraint.video) {
            setMediaError(null);
          } else if (constraint.audio && !constraint.video) {
            setMediaError('No detectamos cámara, pero podrás usar el micrófono.');
          } else if (!constraint.audio && constraint.video) {
            setMediaError('No detectamos micrófono, pero podrás usar la cámara.');
          }
          return stream;
        } catch (error: any) {
          if (constraint.audio && constraint.video && error?.name !== 'NotFoundError' && error?.name !== 'OverconstrainedError') {
            throw error;
          }
          if (!constraint.video && constraint.audio && error?.name !== 'NotFoundError') {
            throw error;
          }
          if (constraint.video && !constraint.audio && error?.name !== 'NotFoundError') {
            throw error;
          }
        }
      }
      return null;
    };

    const initMedia = async () => {
      if (!allowBroadcast) {
        return;
      }
      try {
        const stream = await requestStream();
        if (mounted) {
          if (stream) {
            setLocalStream(stream);
          } else {
            setMediaError('No encontramos cámara ni micrófono disponibles. Aún puedes unirte como oyente.');
          }
        }
      } catch (error) {
        console.error('No se pudo acceder a la cámara/micrófono', error);
        setMediaError('No pudimos acceder a tus dispositivos de audio/video. Revisa los permisos del navegador.');
      }
    };

    initMedia();

    const handleSignal = (signal: CallSignal) => {
      if (!session || !user) return;
      switch (signal.type) {
        case 'JOIN':
          if (signal.from === user.id) return;
          crearPeer(signal.from, signal.from > user.id);
          setHasRemoteParticipant(true);
          break;
        case 'SIGNAL': {
          if (signal.to !== user.id) return;
          if (!signal.payload) {
            console.warn('[CALL] Received SIGNAL without payload', signal);
            return;
          }
          let peer = peersRef.current[signal.from];
          if (!peer) {
            peer = crearPeer(signal.from, signal.from > user.id);
          }
          if (peer && signal.payload) {
            try {
              // Ensure payload is an object, not a string
              let payload = signal.payload;
              if (typeof payload === 'string') {
                try {
                  payload = JSON.parse(payload);
                } catch (e) {
                  console.error('[CALL] Failed to parse payload as JSON, using as-is', e);
                }
              }
              // Validate that payload is an object with expected SimplePeer signal structure
              if (payload && typeof payload === 'object') {
                peer.signal(payload);
              } else {
                console.error('[CALL] Invalid payload format for peer.signal()', payload);
              }
            } catch (error) {
              console.error('[CALL] Error signaling peer', error, 'Payload:', signal.payload);
            }
          }
          break;
        }
        case 'LEAVE':
          cerrarPeer(signal.from);
          setHasRemoteParticipant(false);
          break;
        case 'END':
          onEnded?.();
          break;
        default:
          break;
      }
    };

    callSignalingService.connect(session.id, handleSignal, () => {
      callSignalingService.send(session.id, { type: 'JOIN', from: user.id });
    });

    return () => {
      mounted = false;
      callSignalingService.send(session.id, { type: 'LEAVE', from: user.id });
      callSignalingService.disconnect();
      Object.values(peersRef.current).forEach((peer) => peer.destroy());
      peersRef.current = {};
      remoteStreams.forEach(({ stream }) => stream.getTracks().forEach((track) => track.stop()));
      setRemoteStreams([]);
      localStream?.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setHasRemoteParticipant(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id, user?.id, allowBroadcast]);

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  useEffect(() => {
    if (!localStream || !allowBroadcast) {
      return;
    }
    Object.values(peersRef.current).forEach((peer) => {
      const existingStreams = (peer as any).streams as MediaStream[] | undefined;
      const alreadyAttached = existingStreams?.some((stream) => stream.id === localStream.id);
      if (alreadyAttached) {
        return;
      }
      try {
        peer.addStream(localStream);
      } catch {
        localStream.getTracks().forEach((track) => {
          try {
            peer.addTrack(track, localStream);
          } catch {
            // ignore duplicate track errors
          }
        });
      }
    });
  }, [localStream, allowBroadcast]);

  const crearPeer = (otherUserId: number, initiator: boolean) => {
    if (!session || !user) return null;
    if (peersRef.current[otherUserId]) {
      return peersRef.current[otherUserId];
    }
    
    const peerConfig: any = {
      initiator,
      trickle: true,
      config: {
        iceServers: ICE_SERVERS
      }
    };
    
    if (allowBroadcast && localStreamRef.current) {
      peerConfig.stream = localStreamRef.current;
    }
    
    const peer = new SimplePeer(peerConfig);

    peer.on('signal', (data) => {
      callSignalingService.send(session.id, {
        type: 'SIGNAL',
        from: user.id,
        to: otherUserId,
        payload: data
      });
    });

    peer.on('stream', (stream) => {
      setRemoteStreams((prev) => [...prev.filter((p) => p.userId !== otherUserId), { userId: otherUserId, stream }]);
      setHasRemoteParticipant(true);
    });

    peer.on('close', () => {
      cerrarPeer(otherUserId);
    });

    peer.on('error', (error) => {
      console.error('Peer error', error);
      cerrarPeer(otherUserId);
    });

    peersRef.current[otherUserId] = peer;
    return peer;
  };

  const cerrarPeer = (userId: number) => {
    const peer = peersRef.current[userId];
    if (peer) {
      peer.destroy();
      delete peersRef.current[userId];
      setRemoteStreams((prev) => prev.filter((p) => p.userId !== userId));
    }
  };

  return {
    localStream,
    remoteStreams,
    allowBroadcast,
    hasRemoteParticipant,
    mediaError
  };
};

