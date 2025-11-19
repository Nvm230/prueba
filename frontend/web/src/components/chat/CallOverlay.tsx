import { useEffect, useRef, useState } from 'react';
import { CallSession, endCallSession, callSignalingService } from '@/services/callService';
import { useCallSession } from '@/hooks/useCallSession';
import { useAuth } from '@/hooks/useAuth';
import { XMarkIcon, MicrophoneIcon, SpeakerXMarkIcon, VideoCameraIcon, VideoCameraSlashIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { useToast } from '@/contexts/ToastContext';

interface CallOverlayProps {
  session: CallSession;
  onClose: () => void;
}

const hasActiveVideo = (stream?: MediaStream | null) =>
  !!stream && stream.getVideoTracks().some((track) => track.enabled && track.readyState === 'live');

const CallOverlay: React.FC<CallOverlayProps> = ({ session, onClose }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const { localStream, remoteStreams, allowBroadcast, hasRemoteParticipant, mediaError } = useCallSession({
    session,
    onEnded: () => {
      pushToast({ type: 'info', title: 'Llamada finalizada', description: 'El organizador terminó la llamada.' });
      onClose();
    }
  });
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [callAnswered, setCallAnswered] = useState(false);
  const ringTimeoutRef = useRef<number | null>(null);
  const answeredAtRef = useRef<number | null>(null);
  const isPrivateCaller = session.contextType === 'PRIVATE' && session.createdById === user?.id;
  const audioTracks = localStream?.getAudioTracks() ?? [];
  const videoTracks = localStream?.getVideoTracks() ?? [];
  const canControlMic = allowBroadcast && audioTracks.length > 0;
  const canControlCam = allowBroadcast && videoTracks.length > 0;

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (hasRemoteParticipant && !callAnswered) {
      setCallAnswered(true);
      answeredAtRef.current = Date.now();
      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }
    }
  }, [hasRemoteParticipant, callAnswered]);

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
    if (!localStream || audioTracks.length === 0) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });
    setMicEnabled((prev) => !prev);
  };

  const handleToggleCam = () => {
    if (!localStream || videoTracks.length === 0) return;
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
          await endCallSession(session.id);
          callSignalingService.send(session.id, { type: 'END', from: user.id });
        } else {
          callSignalingService.send(session.id, { type: 'LEAVE', from: user.id });
        }
      }
    } catch (error) {
      console.error('Error al finalizar la llamada', error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <p className="text-sm text-white/70 uppercase tracking-wide">Sesión en vivo</p>
          <h2 className="text-2xl font-semibold text-white">
            Llamada {session.mode === 'CONFERENCE' ? 'en conferencia' : 'grupal'}
            {!callAnswered && isPrivateCaller && <span className="ml-3 text-sm font-normal text-white/70">(Llamando...)</span>}
          </h2>
          {mediaError && (
            <p className="mt-1 text-xs text-amber-200 bg-amber-500/20 inline-flex px-2 py-1 rounded-full">
              {mediaError}
            </p>
          )}
        </div>
        <button onClick={handleHangup} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-2 gap-4 p-6 overflow-y-auto">
        {allowBroadcast ? (
          <div className="relative bg-black rounded-2xl overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!camEnabled || !hasActiveVideo(localStream) ? 'opacity-0' : ''}`}
            />
            {(!camEnabled || !hasActiveVideo(localStream)) && (
              <VideoPlaceholder label={user?.name ?? 'Tú'} avatarUrl={user?.profilePictureUrl} />
            )}
            <span className="absolute bottom-3 left-3 text-white text-sm bg-white/20 px-3 py-1 rounded-full">Tú</span>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/20 border-dashed flex items-center justify-center text-white/70 px-6 text-center">
            Solo el anfitrión puede compartir audio y video en el modo conferencia.
          </div>
        )}
        {remoteStreams.length === 0 ? (
          <div className="rounded-2xl border border-white/20 border-dashed flex items-center justify-center text-white/60">
            Esperando participantes...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {remoteStreams.map((remote) => (
              <RemoteVideo key={remote.userId} remote={remote} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 pb-8">
        <button
          type="button"
          onClick={handleToggleMic}
          disabled={!canControlMic}
          className={`rounded-full p-4 ${micEnabled ? 'bg-white/20' : 'bg-amber-500/60'} text-white`}
        >
          {micEnabled ? <MicrophoneIcon className="h-6 w-6" /> : <SpeakerXMarkIcon className="h-6 w-6" />}
        </button>
        <button
          type="button"
          onClick={handleToggleCam}
          disabled={!canControlCam}
          className={`rounded-full p-4 ${camEnabled ? 'bg-white/20' : 'bg-amber-500/60'} text-white`}
        >
          {camEnabled ? <VideoCameraIcon className="h-6 w-6" /> : <VideoCameraSlashIcon className="h-6 w-6" />}
        </button>
        <button type="button" onClick={handleHangup} className="rounded-full p-4 bg-rose-600 text-white">
          <PhoneXMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

const RemoteVideo: React.FC<{ remote: { userId: number; stream: MediaStream } }> = ({ remote }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = remote.stream;
    }
  }, [remote.stream]);

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${hasActiveVideo(remote.stream) ? '' : 'opacity-0'}`}
      />
      {!hasActiveVideo(remote.stream) && <VideoPlaceholder label={`Usuario #${remote.userId}`} />}
      <span className="absolute bottom-3 left-3 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
        Usuario #{remote.userId}
      </span>
    </div>
  );
};

const VideoPlaceholder: React.FC<{ label: string; avatarUrl?: string }> = ({ label, avatarUrl }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/70 text-white">
    {avatarUrl ? (
      <img src={avatarUrl} alt={label} className="h-20 w-20 rounded-full object-cover border-4 border-white/20" />
    ) : (
      <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-semibold">
        {label.slice(0, 2).toUpperCase()}
      </div>
    )}
    <p className="mt-2 text-sm">{label}</p>
  </div>
);

export default CallOverlay;

