import { useEffect, useRef, useState } from 'react';
import { CallSession, endCallSession, callSignalingService } from '@/services/callService';
import { useCallSession } from '@/hooks/useCallSession';
import { useAuth } from '@/hooks/useAuth';
import { XMarkIcon, MicrophoneIcon, SpeakerXMarkIcon, VideoCameraIcon, VideoCameraSlashIcon, PhoneXMarkIcon, ComputerDesktopIcon } from '@heroicons/react/24/solid';
import { useToast } from '@/contexts/ToastContext';
import { getUserProfile } from '@/services/socialService';

interface CallOverlayProps {
  session: CallSession;
  onClose: () => void;
}

const hasActiveVideo = (stream?: MediaStream | null) =>
  !!stream && stream.getVideoTracks().some((track) => track.enabled && track.readyState === 'live');

const CallOverlay: React.FC<CallOverlayProps> = ({ session, onClose }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const { localStream, remoteStreams, allowBroadcast, hasRemoteParticipant, mediaError, connectedUsers, connectedPeers, isScreenSharing, toggleScreenShare } = useCallSession({
    session,
    onEnded: () => {
      pushToast({ type: 'info', title: 'Llamada finalizada', description: 'El organizador terminó la llamada.' });
      onClose();
    }
  });
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const isConferenceMode = session.mode === 'CONFERENCE';
  const isCreator = session.createdById === user?.id;
  // En modo conferencia, solo el creador puede tener mic/cam activados inicialmente
  const initialMicState = isConferenceMode ? isCreator : true;
  const initialCamState = isConferenceMode ? isCreator : true;
  const [micEnabled, setMicEnabled] = useState(initialMicState);
  const [camEnabled, setCamEnabled] = useState(initialCamState);
  const [callAnswered, setCallAnswered] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const ringTimeoutRef = useRef<number | null>(null);
  const answeredAtRef = useRef<number | null>(null);
  const isPrivateCaller = session.contextType === 'PRIVATE' && session.createdById === user?.id;
  const audioTracks = localStream?.getAudioTracks() ?? [];
  const videoTracks = localStream?.getVideoTracks() ?? [];
  // En modo conferencia, solo el creador puede controlar mic/cam
  const canControlMic = allowBroadcast && audioTracks.length > 0 && (!isConferenceMode || isCreator);
  const canControlCam = allowBroadcast && videoTracks.length > 0 && (!isConferenceMode || isCreator);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // En modo conferencia, desactivar mic/cam para usuarios que no son el creador
  useEffect(() => {
    if (isConferenceMode && !isCreator && localStream) {
      // Desactivar todos los tracks de audio y video
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      setMicEnabled(false);
      setCamEnabled(false);
    }
  }, [isConferenceMode, isCreator, localStream]);

  useEffect(() => {
    // Marcar como contestada cuando hay participantes conectados (incluso sin streams aún)
    // Esto asegura que el contador aparezca en ambos lados
    const shouldBeAnswered = hasRemoteParticipant || remoteStreams.length > 0 || (connectedUsers && connectedUsers.length > 0);
    if (shouldBeAnswered && !callAnswered) {
      console.log('[CALL] Call answered, hasRemoteParticipant:', hasRemoteParticipant, 'remoteStreams:', remoteStreams.length, 'connectedUsers:', connectedUsers?.length || 0);
      setCallAnswered(true);
      answeredAtRef.current = Date.now();
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
    }
  }, [hasRemoteParticipant, callAnswered, remoteStreams.length, connectedUsers]);

  // Cronómetro de la llamada
  useEffect(() => {
    if (!callAnswered || !answeredAtRef.current) {
      return;
    }

    const interval = setInterval(() => {
      if (answeredAtRef.current) {
        const elapsed = Math.floor((Date.now() - answeredAtRef.current) / 1000);
        setCallDuration(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [callAnswered]);

  useEffect(() => {
    if (!isPrivateCaller || callAnswered) {
      return;
    }
    ringTimeoutRef.current = window.setTimeout(() => {
      pushToast({
        type: 'warning',
        title: 'Llamada no contestada',
        description: 'Se marcó como perdida después de 15 segundos.'
      });
      handleHangup();
    }, 15000);
    return () => {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivateCaller, callAnswered]);

  const handleToggleMic = () => {
    if (!canControlMic || !localStream || audioTracks.length === 0) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });
    setMicEnabled((prev) => !prev);
  };

  const handleToggleCam = () => {
    if (!canControlCam || !localStream || videoTracks.length === 0) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !camEnabled;
    });
    setCamEnabled((prev) => !prev);
  };

  const handleHangup = async () => {
    try {
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
      if (user?.id) {
        const isOwner = session.createdById === user.id;
        if (isOwner || session.contextType === 'PRIVATE') {
          callSignalingService.send({ type: 'end', userId: user.id });
          await endCallSession(session.id);
        } else {
          callSignalingService.send({ type: 'leave', userId: user.id });
        }
      }
    } catch (error) {
      console.error('Error al finalizar la llamada', error);
    } finally {
      onClose();
    }
  };

  // Mostrar error de HTTPS si existe
  if (mediaError && mediaError.includes('HTTPS')) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-xl md:rounded-2xl border border-amber-500/50 p-6 md:p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <XMarkIcon className="h-8 w-8 md:h-10 md:w-10 text-amber-400" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-2">HTTPS Requerido</h2>
            <p className="text-sm md:text-base text-white/80 mb-4">{mediaError}</p>
            <p className="text-xs md:text-sm text-white/60 mb-6">
              Las videollamadas usan WebRTC, que requiere una conexión segura (HTTPS) en producción para proteger tu privacidad.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <p className="text-sm text-white/70 uppercase tracking-wide">Sesión en vivo</p>
          <h2 className="text-2xl font-semibold text-white">
            Llamada {session.mode === 'CONFERENCE' ? 'en conferencia' : 'grupal'}
            {!callAnswered && isPrivateCaller && <span className="ml-3 text-sm font-normal text-white/70">(Llamando...)</span>}
            {callAnswered && (
              <span className="ml-3 text-lg font-mono text-white/90">
                {Math.floor(callDuration / 60).toString().padStart(2, '0')}:
                {(callDuration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </h2>
          {mediaError && !mediaError.includes('HTTPS') && (
            <p className="mt-1 text-xs text-amber-200 bg-amber-500/20 inline-flex px-2 py-1 rounded-full">
              {mediaError}
            </p>
          )}
          {callAnswered && remoteStreams.length > 0 && (
            <p className="mt-1 text-xs text-green-200 bg-green-500/20 inline-flex px-2 py-1 rounded-full">
              {remoteStreams.length} participante{remoteStreams.length !== 1 ? 's' : ''} conectado{remoteStreams.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button onClick={handleHangup} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Calcular el número total de participantes para el grid */}
        {(() => {
          const totalParticipants = remoteStreams.length + 
            connectedUsers.filter((userId) => !remoteStreams.some((rs) => rs.userId === userId)).length + 
            (allowBroadcast ? 1 : 0);
          
          // Determinar el número de columnas según el número de participantes
          let gridCols = 'grid-cols-1';
          if (totalParticipants === 1) {
            gridCols = 'grid-cols-1';
          } else if (totalParticipants === 2) {
            gridCols = 'grid-cols-1 md:grid-cols-2';
          } else if (totalParticipants <= 4) {
            gridCols = 'grid-cols-1 md:grid-cols-2';
          } else if (totalParticipants <= 6) {
            gridCols = 'grid-cols-2 md:grid-cols-3';
          } else {
            gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
          }

          return (
            <div className={`grid ${gridCols} gap-3 md:gap-4 w-full h-full max-h-full overflow-auto`}>
              {/* Video local */}
              {allowBroadcast && (
                <div className="relative bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden w-full min-h-0" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!camEnabled || !hasActiveVideo(localStream) ? 'hidden' : ''}`}
                  />
                  {(!camEnabled || !hasActiveVideo(localStream)) && (
                    <VideoPlaceholder label={user?.name ?? 'Tú'} avatarUrl={user?.profilePictureUrl} />
                  )}
                  <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white text-xs md:text-sm bg-black/60 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
                    {isScreenSharing ? 'Compartiendo pantalla' : 'Tú'}
                  </span>
                </div>
              )}
              
              {/* Videos remotos */}
              {remoteStreams.map((remote) => (
                <RemoteVideo key={remote.userId} remote={remote} />
              ))}
              
              {/* En modo conferencia, mostrar usuarios con peer conectado (aunque no tengan stream remoto) */}
              {session.mode === 'CONFERENCE' && connectedPeers
                .filter((userId) => !remoteStreams.some((rs) => rs.userId === userId))
                .map((userId) => {
                  console.log('[CALL] Showing connected participant in conference mode:', userId);
                  return <ConnectedParticipant key={userId} userId={userId} />;
                })}
              
              {/* Mostrar usuarios conectados que aún no tienen stream ni peer conectado (solo en modo normal) */}
              {session.mode === 'NORMAL' && connectedUsers
                .filter((userId) => {
                  const hasStream = remoteStreams.some((rs) => rs.userId === userId);
                  const hasConnectedPeer = connectedPeers?.includes(userId);
                  
                  // Solo mostrar como "conectando" si no tiene stream ni peer conectado
                  if (!hasStream && !hasConnectedPeer) {
                    console.log('[CALL] User', userId, 'is in connectedUsers but has no remoteStream or connected peer, showing as connecting');
                    return true;
                  }
                  return false;
                })
                .map((userId) => (
                  <ConnectingUser key={userId} userId={userId} />
                ))}
              
              {/* Mensaje cuando no hay participantes remotos */}
              {!allowBroadcast && (
                <div className="rounded-xl md:rounded-2xl border border-white/20 border-dashed flex items-center justify-center text-white/70 px-4 md:px-6 text-center w-full min-h-0" style={{ aspectRatio: '16/9' }}>
                  <p className="text-sm md:text-base">Solo el anfitrión puede compartir audio y video en el modo conferencia.</p>
                </div>
              )}
              
              {allowBroadcast && remoteStreams.length === 0 && (!hasRemoteParticipant || connectedUsers.length === 0) && (
                <div className="rounded-xl md:rounded-2xl border border-white/20 border-dashed flex flex-col items-center justify-center text-white/60 p-6 md:p-8 w-full min-h-0" style={{ aspectRatio: '16/9' }}>
                  <p className="text-base md:text-lg">Esperando participantes...</p>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="flex items-center justify-center gap-4 pb-8">
        <button
          type="button"
          onClick={handleToggleMic}
          disabled={!canControlMic}
          className={`rounded-full p-4 ${micEnabled ? 'bg-white/20' : 'bg-amber-500/60'} text-white ${
            !canControlMic ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
          }`}
          title={!canControlMic && isConferenceMode && !isCreator ? 'En modo conferencia, solo el anfitrión puede usar el micrófono' : ''}
        >
          {micEnabled ? <MicrophoneIcon className="h-6 w-6" /> : <SpeakerXMarkIcon className="h-6 w-6" />}
        </button>
        <button
          type="button"
          onClick={handleToggleCam}
          disabled={!canControlCam}
          className={`rounded-full p-4 ${camEnabled ? 'bg-white/20' : 'bg-amber-500/60'} text-white ${
            !canControlCam ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
          }`}
          title={!canControlCam && isConferenceMode && !isCreator ? 'En modo conferencia, solo el anfitrión puede usar la cámara' : ''}
        >
          {camEnabled ? <VideoCameraIcon className="h-6 w-6" /> : <VideoCameraSlashIcon className="h-6 w-6" />}
        </button>
        <button
          type="button"
          onClick={toggleScreenShare}
          disabled={!canControlCam || !allowBroadcast}
          className={`rounded-full p-4 ${isScreenSharing ? 'bg-green-600' : 'bg-white/20'} text-white ${
            !canControlCam || !allowBroadcast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30'
          }`}
          title={isScreenSharing ? 'Dejar de compartir pantalla' : 'Compartir pantalla'}
        >
          <ComputerDesktopIcon className="h-6 w-6" />
        </button>
        <button type="button" onClick={handleHangup} className="rounded-full p-4 bg-rose-600 text-white hover:bg-rose-700">
          <PhoneXMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

const RemoteVideo: React.FC<{ remote: { userId: number; stream: MediaStream } }> = ({ remote }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userName, setUserName] = useState<string>(`Usuario #${remote.userId}`);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = remote.stream;
    }
  }, [remote.stream]);

  useEffect(() => {
    // Obtener información del usuario
    getUserProfile(remote.userId)
      .then((profile) => {
        setUserName(profile.name || `Usuario #${remote.userId}`);
        setAvatarUrl(profile.profilePictureUrl);
      })
      .catch(() => {
        // Si falla, mantener el nombre por defecto
      });
  }, [remote.userId]);

  // Verificar si hay video activo periódicamente
  useEffect(() => {
    const checkVideo = () => {
      const active = hasActiveVideo(remote.stream);
      setHasVideo(active);
    };
    
    checkVideo();
    const interval = setInterval(checkVideo, 500);
    
    return () => clearInterval(interval);
  }, [remote.stream]);

  return (
    <div className="relative bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden w-full min-h-0" style={{ aspectRatio: '16/9' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${hasVideo ? '' : 'hidden'}`}
      />
      {!hasVideo && <VideoPlaceholder label={userName} avatarUrl={avatarUrl} />}
      <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white text-xs md:text-sm bg-black/60 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium truncate max-w-[80%]">
        {userName}
      </span>
    </div>
  );
};

const VideoPlaceholder: React.FC<{ label: string; avatarUrl?: string }> = ({ label, avatarUrl }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4">
    {avatarUrl ? (
      <img 
        src={avatarUrl} 
        alt={label} 
        className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-2 md:border-4 border-white/30 shadow-lg" 
        onError={(e) => {
          // Si la imagen falla, mostrar el placeholder con iniciales
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }
        }}
      />
    ) : null}
    <div 
      className={`avatar-fallback h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-semibold border-2 md:border-4 border-white/30 shadow-lg ${avatarUrl ? 'hidden' : ''}`}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
    <p className="mt-3 md:mt-4 text-sm md:text-base font-medium text-center px-2 truncate w-full">{label}</p>
  </div>
);

const ConnectingUser: React.FC<{ userId: number }> = ({ userId }) => {
  const [userName, setUserName] = useState<string>(`Usuario #${userId}`);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    getUserProfile(userId)
      .then((profile) => {
        setUserName(profile.name || `Usuario #${userId}`);
        setAvatarUrl(profile.profilePictureUrl);
      })
      .catch(() => {
        // Si falla, mantener el nombre por defecto
      });
  }, [userId]);

  return (
    <div className="relative bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden border border-white/20 w-full min-h-0" style={{ aspectRatio: '16/9' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 md:p-8">
        <div className="animate-pulse mb-3 md:mb-4">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={userName} 
              className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-2 md:border-4 border-white/30 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className={`avatar-fallback h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-semibold border-2 md:border-4 border-white/30 shadow-lg ${avatarUrl ? 'hidden' : ''}`}
          >
            {userName.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <p className="text-sm md:text-base font-medium text-center px-2 truncate w-full">{userName}</p>
        <p className="text-xs text-white/60 mt-1 md:mt-2">Conectando...</p>
        <div className="mt-3 md:mt-4 flex gap-1.5">
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

const ConnectedParticipant: React.FC<{ userId: number }> = ({ userId }) => {
  const [userName, setUserName] = useState<string>(`Usuario #${userId}`);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    getUserProfile(userId)
      .then((profile) => {
        setUserName(profile.name || `Usuario #${userId}`);
        setAvatarUrl(profile.profilePictureUrl);
      })
      .catch(() => {
        // Si falla, mantener el nombre por defecto
      });
  }, [userId]);

  return (
    <div className="relative bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden border border-green-500/50 w-full min-h-0" style={{ aspectRatio: '16/9' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 md:p-8">
        <div className="mb-3 md:mb-4">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={userName} 
              className="h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-2 md:border-4 border-green-500/50 shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className={`avatar-fallback h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl md:text-2xl lg:text-3xl font-semibold border-2 md:border-4 border-green-500/50 shadow-lg ${avatarUrl ? 'hidden' : ''}`}
          >
            {userName.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <p className="text-sm md:text-base font-medium text-center px-2 truncate w-full">{userName}</p>
        <p className="text-xs text-green-400/80 mt-1 md:mt-2 flex items-center gap-1.5">
          <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
          Conectado
        </p>
      </div>
    </div>
  );
};

export default CallOverlay;

