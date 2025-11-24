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
  { urls: 'stun:global.stun.twilio.com:3478' }
];

export const useCallSession = ({ session, onEnded }: UseCallSessionOptions) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const peersRef = useRef<Record<number, SimplePeer.Instance>>({});
  const connectedUsersRef = useRef<Set<number>>(new Set()); // Track connected users even without streams
  const connectedPeersRef = useRef<Set<number>>(new Set()); // Track users with connected peers (even without remote stream)
  const allowBroadcast = session && user ? (session.mode === 'NORMAL' || session.createdById === user.id) : false;
  const [hasRemoteParticipant, setHasRemoteParticipant] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalVideoTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    if (!session || !user) {
      return;
    }

    // Validar HTTPS en producción (WebRTC requiere HTTPS excepto en localhost)
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '[::1]';
      const isHttps = window.location.protocol === 'https:';
      
      if (!isLocalhost && !isHttps) {
        const errorMsg = 'Las videollamadas requieren HTTPS en producción. Por favor, accede a la aplicación usando HTTPS (https://...) en lugar de HTTP.';
        console.error('[CALL] WebRTC blocked: HTTPS required in production');
        setMediaError(errorMsg);
        return;
      }
    }

    let mounted = true;

    const requestStream = async (): Promise<MediaStream | null> => {
      // En modo conferencia, solo el creador puede solicitar micrófono y cámara
      const isConferenceMode = session.mode === 'CONFERENCE';
      const isCreator = session.createdById === user.id;
      
      if (isConferenceMode && !isCreator) {
        // En modo conferencia, usuarios que no son el creador no solicitan dispositivos
        setMediaError('En modo conferencia, solo el anfitrión puede compartir audio y video.');
        return null;
      }

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
      
      // Manejar diferentes tipos de señales WebRTC
      if (signal.type === 'offer') {
        // Recibimos una oferta, crear peer como receptor
        const otherUserId = signal.from || 0;
        console.log('[CALL] 📥 Received offer from user:', otherUserId, 'My ID:', user.id);
        if (!otherUserId || otherUserId === user.id) {
          console.warn('[CALL] Invalid offer: otherUserId:', otherUserId, 'myId:', user.id);
          return;
        }
        
        let peer = peersRef.current[otherUserId];
        if (!peer) {
          console.log('[CALL] Creating peer as receiver for user:', otherUserId, 'hasLocalStream:', !!localStreamRef.current, 'allowBroadcast:', allowBroadcast, 'mode:', session.mode);
          // Crear peer como receptor (no iniciador) cuando recibimos el offer
          peer = crearPeerWithOffer(otherUserId, signal.offer);
          if (!peer) {
            console.error('[CALL] ✗ Failed to create peer as receiver for user:', otherUserId);
            return;
          }
          console.log('[CALL] ✓ Peer created, answer should be generated and sent automatically');
        } else {
          // Si el peer ya existe, señalarlo con el offer
          if (signal.offer && !(peer as any)._offerReceived) {
            try {
              console.log('[CALL] Signaling offer to existing peer');
              peer.signal(signal.offer);
              (peer as any)._offerReceived = true;
              console.log('[CALL] ✓ Offer signaled to existing peer, answer should be generated');
            } catch (error) {
              console.error('[CALL] Error signaling offer to existing peer:', error);
            }
          } else {
            console.log('[CALL] Peer already received offer, skipping');
          }
        }
        setHasRemoteParticipant(true);
      } else if (signal.type === 'answer') {
        // Recibimos una respuesta
        const otherUserId = signal.from || 0;
        console.log('[CALL] Received answer from user:', otherUserId);
        const peer = peersRef.current[otherUserId];
        if (peer && signal.answer) {
          try {
            peer.signal(signal.answer);
            console.log('[CALL] Answer signaled to peer');
          } catch (error) {
            console.error('[CALL] Error signaling answer:', error);
          }
        } else {
          console.warn('[CALL] Received answer but no peer found for user:', otherUserId);
        }
      } else if (signal.type === 'candidate') {
        // Recibimos un candidato ICE
        const otherUserId = signal.from || 0;
        const peer = peersRef.current[otherUserId];
        if (peer && signal.candidate) {
          peer.signal(signal.candidate);
        }
      } else if (signal.type === 'join') {
        // Alguien se unió a la sala
        const otherUserId = signal.userId ? (typeof signal.userId === 'number' ? signal.userId : parseInt(signal.userId.toString())) : 0;
        if (otherUserId && otherUserId !== user.id) {
          console.log('[CALL] User joined:', otherUserId, 'My ID:', user.id, 'Has stream:', !!localStreamRef.current, 'Allow broadcast:', allowBroadcast);
          connectedUsersRef.current.add(otherUserId);
          setHasRemoteParticipant(true);
          
          // Función para intentar crear el peer
          const tryCreatePeer = () => {
            // En modo conferencia, solo el creador puede iniciar peers
            const isConferenceMode = session.mode === 'CONFERENCE';
            const isCreator = session.createdById === user.id;
            
            // En modo conferencia, si no somos el creador, no podemos crear peers como iniciador
            if (isConferenceMode && !isCreator) {
              console.log('[CALL] Conference mode: I am not creator, will wait for offer from creator');
              return;
            }
            
            if (!allowBroadcast || !localStreamRef.current) {
              console.log('[CALL] Cannot create peer - allowBroadcast:', allowBroadcast, 'hasStream:', !!localStreamRef.current);
              return;
            }
            
            // Validar que el stream tenga tracks
            const tracks = localStreamRef.current.getTracks();
            if (tracks.length === 0) {
              console.log('[CALL] Stream has no tracks yet, waiting...');
              return;
            }
            
            // Determinar quién es el iniciador:
            // - En modo conferencia: siempre el creador
            // - En modo normal: el usuario con ID mayor
            let shouldBeInitiator = false;
            if (isConferenceMode) {
              shouldBeInitiator = isCreator;
              console.log('[CALL] Conference mode: I am', (isCreator ? 'creator (initiator)' : 'participant (receiver)'));
            } else {
              shouldBeInitiator = user.id > otherUserId;
              console.log('[CALL] Normal mode: I am', (shouldBeInitiator ? 'initiator' : 'receiver'), '(', user.id, shouldBeInitiator ? '>' : '<', otherUserId, ')');
            }
            
            if (shouldBeInitiator) {
              console.log('[CALL] Creating peer as initiator for user:', otherUserId);
              if (!peersRef.current[otherUserId]) {
                // Pequeño delay para asegurar que todo esté listo
                setTimeout(() => {
                  if (!peersRef.current[otherUserId] && localStreamRef.current && allowBroadcast) {
                    const peer = crearPeer(otherUserId, true);
                    if (peer) {
                      console.log('[CALL] ✓ Peer created as initiator successfully, offer should be sent soon');
                    } else {
                      console.error('[CALL] ✗ Failed to create peer as initiator');
                    }
                  }
                }, 300);
              } else {
                console.log('[CALL] Peer already exists for user:', otherUserId);
              }
            } else {
              // El usuario espera recibir el offer
              console.log('[CALL] I am receiver, waiting for offer from user:', otherUserId);
            }
          };
          
          // Intentar crear peer inmediatamente si tenemos stream
          if (allowBroadcast && localStreamRef.current) {
            tryCreatePeer();
          } else {
            console.log('[CALL] No local stream yet, will create peer when stream is ready');
            // El stream se creará más tarde, y el useEffect lo manejará
          }
        }
      } else if (signal.type === 'leave') {
        const otherUserId = signal.from || signal.userId || 0;
        console.log('[CALL] User left:', otherUserId);
        if (otherUserId) {
          cerrarPeer(otherUserId);
        }
      } else if (signal.type === 'end') {
        onEnded?.();
      } else if (signal.type === 'signal' && signal.payload) {
        // Fallback para señales genéricas (SimplePeer)
        const otherUserId = signal.from || 0;
        let peer = peersRef.current[otherUserId];
        if (!peer) {
          // En modo conferencia, solo el creador puede ser iniciador
          const isConferenceMode = session?.mode === 'CONFERENCE';
          const isCreator = session?.createdById === user.id;
          const shouldBeInitiator = isConferenceMode ? isCreator : (user.id > otherUserId);
          peer = crearPeer(otherUserId, shouldBeInitiator);
        }
        if (peer) {
          try {
            let payload = signal.payload;
            if (typeof payload === 'string') {
              payload = JSON.parse(payload);
            }
            if (payload && typeof payload === 'object') {
              peer.signal(payload);
            }
          } catch (error) {
            console.error('[CALL] Error signaling peer', error);
          }
        }
      }
    };

    callSignalingService.connect(session.id, user.id, handleSignal, () => {
      console.log('[CALL] WebSocket connected and join sent for session:', session.id, 'user:', user.id);
    });

    return () => {
      mounted = false;
      callSignalingService.send({ type: 'leave', userId: user.id });
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
    console.log('[CALL] Local stream ready, attaching to peers:', Object.keys(peersRef.current).length, 'Connected users:', Array.from(connectedUsersRef.current));
    Object.values(peersRef.current).forEach((peer) => {
      const existingStreams = (peer as any).streams as MediaStream[] | undefined;
      const alreadyAttached = existingStreams?.some((stream) => stream.id === localStream.id);
      if (alreadyAttached) {
        return;
      }
      try {
        peer.addStream(localStream);
        console.log('[CALL] Stream attached to peer');
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
    
    // Si hay participantes conectados pero no hay peers creados, intentar crearlos
    // Esto puede pasar si el stream se obtuvo después de recibir el join
    // Solo crear peers como iniciadores (el usuario con ID mayor)
    if (connectedUsersRef.current.size > 0 && localStreamRef.current && allowBroadcast) {
      const tracks = localStreamRef.current.getTracks();
      console.log('[CALL] Stream ready, checking for peers to create. Connected users:', Array.from(connectedUsersRef.current), 'Current peers:', Object.keys(peersRef.current), 'Tracks:', tracks.length);
      
      if (tracks.length === 0) {
        console.log('[CALL] Stream has no tracks yet, will retry...');
        return;
      }
      
      // Determinar quién es el iniciador basado en el modo
      const isConferenceMode = session?.mode === 'CONFERENCE';
      const isCreator = session?.createdById === user?.id;
      
      connectedUsersRef.current.forEach((otherUserId) => {
        if (otherUserId !== user?.id && !peersRef.current[otherUserId]) {
          // En modo conferencia, solo el creador puede ser iniciador
          // En modo normal, el usuario con ID mayor es el iniciador
          let shouldBeInitiator = false;
          if (isConferenceMode) {
            shouldBeInitiator = isCreator;
            console.log('[CALL] Conference mode: I am', (isCreator ? 'creator (will initiate)' : 'participant (will wait for offer)'));
          } else {
            shouldBeInitiator = (user?.id || 0) > otherUserId;
            console.log('[CALL] Normal mode: I am', (shouldBeInitiator ? 'initiator' : 'receiver'), '(', user?.id, shouldBeInitiator ? '>' : '<', otherUserId, ')');
          }
          
          if (shouldBeInitiator) {
            // Solo crear como iniciador si tenemos stream
            console.log('[CALL] ⚡ Creating peer for user:', otherUserId, 'as initiator (stream now ready with', tracks.length, 'tracks)');
            // Pequeño delay para asegurar que todo esté listo
            setTimeout(() => {
              if (localStreamRef.current && !peersRef.current[otherUserId] && allowBroadcast) {
                const peer = crearPeer(otherUserId, true);
                if (peer) {
                  console.log('[CALL] ✓ Peer created as initiator after stream ready, offer should be sent soon');
                } else {
                  console.error('[CALL] ✗ Failed to create peer as initiator after stream ready');
                }
              } else {
                console.log('[CALL] Conditions changed, not creating peer. hasStream:', !!localStreamRef.current, 'hasPeer:', !!peersRef.current[otherUserId], 'allowBroadcast:', allowBroadcast);
              }
            }, 300);
          } else {
            // Si somos el receptor, esperamos el offer
            console.log('[CALL] Will wait for offer from user:', otherUserId);
          }
        }
      });
    }
  }, [localStream, allowBroadcast, hasRemoteParticipant, user?.id]);

  const crearPeerWithOffer = (otherUserId: number, offer: any) => {
    if (!session || !user) return null;
    if (peersRef.current[otherUserId]) {
      console.log('[CALL] Peer already exists for user:', otherUserId, 'signaling offer to existing peer');
      const existingPeer = peersRef.current[otherUserId];
      if (offer && !(existingPeer as any)._offerReceived) {
        try {
          existingPeer.signal(offer);
          (existingPeer as any)._offerReceived = true;
          console.log('[CALL] Offer signaled to existing peer');
        } catch (error) {
          console.error('[CALL] Error signaling offer to existing peer:', error);
        }
      }
      return existingPeer;
    }
    
    // Como receptor, no necesitamos stream local para recibir streams remotos
    // Solo lo necesitamos si queremos enviar media también
    const hasLocalStream = allowBroadcast && localStreamRef.current;
    
    if (!hasLocalStream) {
      console.log('[CALL] Creating peer as receiver without local stream (will only receive)');
    }
    
    const peerConfig: any = {
      initiator: false,
      trickle: true,
      config: {
        iceServers: ICE_SERVERS
      }
    };
    
    // Solo agregar stream si lo tenemos (para enviar media)
    if (hasLocalStream) {
      peerConfig.stream = localStreamRef.current;
      console.log('[CALL] Including local stream in receiver peer config');
    }
    
    console.log('[CALL] Creating SimplePeer as receiver with offer, hasLocalStream:', hasLocalStream);
    
    try {
      const peer = new SimplePeer(peerConfig);
      
      // IMPORTANTE: Configurar handlers ANTES de señalar el offer
      // Esto asegura que el answer se capture y envíe correctamente
      setupPeerHandlers(peer, otherUserId);
      
      // Señalar el offer después de configurar los handlers
      if (offer) {
        try {
          console.log('[CALL] Signaling offer to peer (will generate answer)');
          peer.signal(offer);
          (peer as any)._offerReceived = true;
          console.log('[CALL] ✓ Offer signaled to new peer, waiting for answer generation...');
        } catch (error) {
          console.error('[CALL] Error signaling offer during peer creation:', error);
        }
      }
      
      peersRef.current[otherUserId] = peer;
      console.log('[CALL] ✓ Peer created as receiver successfully');
      return peer;
    } catch (error) {
      console.error('[CALL] Error creating peer with offer:', error);
      return null;
    }
  };

  const setupPeerHandlers = (peer: SimplePeer.Instance, otherUserId: number) => {
    peer.on('signal', (data) => {
      console.log('[CALL] 🔔 Signal event fired for user:', otherUserId, 'Signal type:', data.type || (data.candidate ? 'candidate' : 'unknown'));
      // SimplePeer envía diferentes tipos de señales
      if (data.type === 'offer') {
        console.log('[CALL] 📤 Sending offer to user:', otherUserId, 'Offer SDP length:', data.sdp?.length || 0);
        callSignalingService.send({
          type: 'offer',
          from: user!.id,
          to: otherUserId,
          room: session!.id.toString(),
          offer: data
        });
      } else if (data.type === 'answer') {
        console.log('[CALL] 📤 Sending answer to user:', otherUserId, 'Answer SDP length:', data.sdp?.length || 0, 'Answer:', JSON.stringify(data).substring(0, 200));
        callSignalingService.send({
          type: 'answer',
          from: user!.id,
          to: otherUserId,
          room: session!.id.toString(),
          answer: data
        });
        console.log('[CALL] ✓ Answer sent successfully to user:', otherUserId);
      } else if (data.candidate) {
        // No loguear cada candidato ICE para no saturar la consola, pero loguear el primero
        if (!(peer as any)._candidateLogged) {
          console.log('[CALL] 📤 Sending ICE candidate to user:', otherUserId);
          (peer as any)._candidateLogged = true;
        }
        callSignalingService.send({
          type: 'candidate',
          from: user!.id,
          to: otherUserId,
          room: session!.id.toString(),
          candidate: data
        });
      } else {
        // Fallback para otros tipos de señales
        console.log('[CALL] 📤 Sending generic signal to user:', otherUserId, 'Type:', data.type, 'Data keys:', Object.keys(data));
        callSignalingService.send({
          type: 'signal',
          from: user!.id,
          to: otherUserId,
          room: session!.id.toString(),
          payload: data
        });
      }
    });

    peer.on('stream', (stream) => {
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      console.log('[CALL] 📥 Received remote stream from user:', otherUserId, 
        'Total tracks:', stream.getTracks().length,
        'Video tracks:', videoTracks.length,
        'Audio tracks:', audioTracks.length,
        'Stream ID:', stream.id);
      
      // Agregar el stream a remoteStreams incluso si solo tiene audio
      // Esto asegura que el usuario aparezca como conectado, no como "conectando"
      setRemoteStreams((prev) => {
        const filtered = prev.filter((p) => p.userId !== otherUserId);
        const updated = [...filtered, { userId: otherUserId, stream }];
        console.log('[CALL] ✓ Updated remoteStreams, total:', updated.length, 'for user:', otherUserId);
        return updated;
      });
      setHasRemoteParticipant(true);
    });
    
    peer.on('connect', () => {
      console.log('[CALL] ✓ Peer connected with user:', otherUserId);
      connectedPeersRef.current.add(otherUserId);
      // En modo conferencia, si el peer está conectado pero no hay stream remoto,
      // aún así el usuario está conectado (solo escuchando/viendo)
      // Agregar un stream "vacío" o placeholder para que aparezca como conectado
      const isConferenceMode = session?.mode === 'CONFERENCE';
      if (isConferenceMode) {
        // Verificar si ya tenemos un stream para este usuario
        const hasExistingStream = remoteStreams.some((rs) => rs.userId === otherUserId);
        if (!hasExistingStream) {
          console.log('[CALL] Conference mode: Peer connected but no remote stream yet for user:', otherUserId, '- user is connected (listening/viewing)');
          // No agregamos un stream vacío aquí, pero el UI debería mostrar que está conectado
          // basándose en que el peer está conectado
        }
      }
    });

    peer.on('close', () => {
      cerrarPeer(otherUserId);
    });

    peer.on('error', (error) => {
      console.error('Peer error', error);
      cerrarPeer(otherUserId);
    });
  };

  const crearPeer = (otherUserId: number, initiator: boolean) => {
    if (!session || !user) {
      console.error('[CALL] Cannot create peer: missing session or user');
      return null;
    }
    if (peersRef.current[otherUserId]) {
      console.log('[CALL] Peer already exists for user:', otherUserId);
      return peersRef.current[otherUserId];
    }
    
    // Solo crear peer si tenemos stream local cuando es necesario
    if (initiator && (!allowBroadcast || !localStreamRef.current)) {
      console.warn('[CALL] Cannot create peer as initiator without local stream. allowBroadcast:', allowBroadcast, 'hasStream:', !!localStreamRef.current);
      return null;
    }
    
    // Validar que el stream tenga tracks antes de crear el peer
    if (initiator && localStreamRef.current) {
      const tracks = localStreamRef.current.getTracks();
      if (tracks.length === 0) {
        console.warn('[CALL] Cannot create peer as initiator without tracks in stream');
        return null;
      }
      console.log('[CALL] Stream has', tracks.length, 'tracks:', tracks.map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
    }
    
    // Como receptor, podemos crear el peer sin stream local (solo recibiremos)
    // El stream local solo es necesario si queremos enviar media también
    // Validar que el stream sea un MediaStream válido
    let validStream: MediaStream | null = null;
    if (allowBroadcast && localStreamRef.current) {
      // Verificar que sea una instancia de MediaStream
      if (localStreamRef.current instanceof MediaStream) {
        const tracks = localStreamRef.current.getTracks();
        // Verificar que tenga tracks activos
        const activeTracks = tracks.filter(t => t.readyState === 'live' && t.enabled);
        if (activeTracks.length > 0) {
          validStream = localStreamRef.current;
          console.log('[CALL] Valid stream found with', activeTracks.length, 'active tracks');
        } else {
          console.warn('[CALL] Stream has no active tracks');
        }
      } else {
        console.error('[CALL] localStreamRef.current is not a MediaStream:', typeof localStreamRef.current, localStreamRef.current);
      }
    }
    
    if (!validStream && initiator) {
      // Si somos iniciador y no tenemos stream válido, no podemos crear el peer
      console.error('[CALL] Cannot create peer as initiator without valid stream');
      return null;
    }
    
    // Crear configuración con stream directamente (como sugiere la documentación)
    const peerConfig: any = {
      initiator: Boolean(initiator),
      trickle: true,
      config: {
        iceServers: ICE_SERVERS
      }
    };
    
    // Pasar el stream directamente en la configuración (SimplePeer lo espera así)
    // Solo agregar stream si lo tenemos (para enviar media)
    if (validStream) {
      peerConfig.stream = validStream;
      console.log('[CALL] Stream included in config, stream ID:', validStream.id, 'Tracks:', validStream.getTracks().length);
    } else if (!initiator) {
      console.log('[CALL] No local stream - peer will only receive remote streams');
    }
    
    console.log('[CALL] Creating SimplePeer with config:', { 
      initiator, 
      hasStream: !!peerConfig.stream,
      streamId: peerConfig.stream?.id,
      userId: otherUserId
    });
    
    try {
      // Crear el peer con la configuración completa
      const peer = new SimplePeer(peerConfig);
      console.log('[CALL] ✓ SimplePeer instance created successfully');
      
      // Configurar handlers inmediatamente
      setupPeerHandlers(peer, otherUserId);
      
      peersRef.current[otherUserId] = peer;
      console.log('[CALL] ✓ SimplePeer fully configured for user:', otherUserId);
      return peer;
    } catch (error: any) {
      console.error('[CALL] ✗ Error creating peer:', error?.message || error);
      console.error('[CALL] Error stack:', error?.stack);
      console.error('[CALL] Error details:', {
        name: error?.name,
        message: error?.message,
        constructor: error?.constructor?.name
      });
      return null;
    }
  };

  const cerrarPeer = (userId: number) => {
    const peer = peersRef.current[userId];
    if (peer) {
      peer.destroy();
      delete peersRef.current[userId];
      setRemoteStreams((prev) => prev.filter((p) => p.userId !== userId));
    }
    connectedUsersRef.current.delete(userId);
    if (connectedUsersRef.current.size === 0) {
      setHasRemoteParticipant(false);
    }
  };

  const toggleScreenShare = async () => {
    if (!localStreamRef.current || !allowBroadcast) {
      return;
    }

    try {
      if (isScreenSharing) {
        // Detener compartir pantalla - restaurar video track original
        if (originalVideoTrackRef.current && localStreamRef.current) {
          const currentVideoTrack = localStreamRef.current.getVideoTracks()[0];
          if (currentVideoTrack) {
            currentVideoTrack.stop();
            localStreamRef.current.removeTrack(currentVideoTrack);
          }
          
          localStreamRef.current.addTrack(originalVideoTrackRef.current);
          originalVideoTrackRef.current.enabled = true;
          
          // Actualizar todos los peers
          Object.values(peersRef.current).forEach((peer) => {
            if (peer && !peer.destroyed) {
              peer.replaceTrack(originalVideoTrackRef.current!, localStreamRef.current!);
            }
          });
        }
        
        // Detener el stream de pantalla
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        
        originalVideoTrackRef.current = null;
        setIsScreenSharing(false);
      } else {
        // Iniciar compartir pantalla
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        screenStreamRef.current = screenStream;
        
        // Guardar el video track original
        const originalVideoTrack = localStreamRef.current.getVideoTracks()[0];
        if (originalVideoTrack) {
          originalVideoTrackRef.current = originalVideoTrack;
        }
        
        // Reemplazar el video track con el de pantalla
        const screenVideoTrack = screenStream.getVideoTracks()[0];
        if (screenVideoTrack && localStreamRef.current) {
          // Remover el track de video actual
          const currentVideoTrack = localStreamRef.current.getVideoTracks()[0];
          if (currentVideoTrack) {
            localStreamRef.current.removeTrack(currentVideoTrack);
            currentVideoTrack.enabled = false; // Desactivar pero no detener
          }
          
          // Agregar el track de pantalla
          localStreamRef.current.addTrack(screenVideoTrack);
          
          // Actualizar todos los peers con el nuevo track
          Object.values(peersRef.current).forEach((peer) => {
            if (peer && !peer.destroyed) {
              peer.replaceTrack(screenVideoTrack, localStreamRef.current!);
            }
          });
        }
        
        // Detener compartir cuando el usuario cierra la ventana de selección
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          if (isScreenSharing) {
            toggleScreenShare();
          }
        });
        
        setIsScreenSharing(true);
      }
    } catch (error: any) {
      console.error('[CALL] Error toggling screen share:', error);
      setMediaError(error?.message || 'Error al compartir pantalla');
    }
  };

  return {
    localStream,
    remoteStreams,
    allowBroadcast,
    hasRemoteParticipant,
    mediaError,
    isScreenSharing,
    toggleScreenShare,
    connectedUsers: Array.from(connectedUsersRef.current), // Export connected users for display
    connectedPeers: Array.from(connectedPeersRef.current) // Export users with connected peers (even without remote stream)
  };
};

