import { useState, useEffect, useRef, useCallback } from 'react';
import { groupChannelService } from '@/services/groupChannelService';
import { getGroupMessages, GroupMessage } from '@/services/groupService';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/display/Avatar';
import {
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  CameraIcon,
  ArrowDownTrayIcon,
  FaceSmileIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { uploadFile as uploadAttachment, downloadFileById } from '@/services/fileService';
import ReactionPicker from './ReactionPicker';
import MessageReactions from './MessageReactions';
import { toggleReaction } from '@/services/messageReactionService';
import StickerPicker from './StickerPicker';
import { Sticker } from '@/services/stickerService';
import { CallSession, CallMode, createCallSession, getActiveCall } from '@/services/callService';
import CallOverlay from './CallOverlay';

interface GroupChannelWindowProps {
  groupId: number;
  canSend: boolean; // Solo owner/SERVER puede enviar
}

// Tipos de archivo permitidos: solo imágenes y PDFs
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'];
const MAX_FILE_SIZE_MB = 10;

const GroupChannelWindow: React.FC<GroupChannelWindowProps> = ({ groupId, canSend }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview?: string } | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [joiningCall, setJoiningCall] = useState(false);
  const [callMode, setCallMode] = useState<CallMode>('NORMAL');

  const upsertMessage = useCallback((updated: GroupMessage) => {
    setMessages((prev) => {
      const index = prev.findIndex((m) => m.id === updated.id);
      if (index !== -1) {
        const next = [...prev];
        next[index] = updated;
        return next;
      }
      return [...prev, updated];
    });
  }, []);

  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['groupMessages', groupId],
    queryFn: ({ signal }) => getGroupMessages(groupId, { page: 0, size: 100 }, signal),
    enabled: Boolean(groupId && user)
  });

  // Sincronizar mensajes guardados
  useEffect(() => {
    if (savedMessages?.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const disconnect = groupChannelService.connect(
      groupId,
      (message: GroupMessage) => {
        upsertMessage(message);
      },
      (error) => {
        console.error('Group channel error:', error);
        setIsConnected(false);
      }
    );

    setIsConnected(true);

    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [groupId, upsertMessage, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const refreshActiveCall = useCallback(async () => {
    try {
      const active = await getActiveCall('GROUP', groupId);
      setActiveCall(active);
    } catch (error) {
      console.error('No se pudo verificar llamadas de grupo', error);
    }
  }, [groupId]);

  useEffect(() => {
    refreshActiveCall();
  }, [refreshActiveCall]);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        pushToast({
          type: 'error',
          title: 'Tipo de archivo no permitido',
          description: 'Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y PDFs.'
        });
        return false;
      }
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      pushToast({
        type: 'error',
        title: 'Archivo demasiado grande',
        description: `El tamaño máximo es ${MAX_FILE_SIZE_MB}MB.`
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      if (event.target === fileInputRef.current) {
        fileInputRef.current.value = '';
      } else if (event.target === cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }
      return;
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({ file });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedFile) || !user || !canSend) return;

    try {
      let fileId: number | undefined;
      let fileType: string | undefined;
      let fileName: string | undefined;

      if (selectedFile) {
        console.log('Uploading file:', {
          name: selectedFile.file.name,
          type: selectedFile.file.type,
          size: selectedFile.file.size
        });

        // Ensure file has proper metadata (important for camera captures)
        const fileToUpload = selectedFile.file;

        // If file type is empty (common with camera captures), try to infer from name or default to image/jpeg
        if (!fileToUpload.type || fileToUpload.type === '') {
          const extension = fileToUpload.name.split('.').pop()?.toLowerCase();
          let inferredType = 'image/jpeg'; // Default for camera captures

          if (extension === 'png') inferredType = 'image/png';
          else if (extension === 'gif') inferredType = 'image/gif';
          else if (extension === 'webp') inferredType = 'image/webp';
          else if (extension === 'pdf') inferredType = 'application/pdf';

          console.log('File type was empty, inferred:', inferredType);

          // Create a new File object with the correct type
          const blob = fileToUpload.slice(0, fileToUpload.size, inferredType);
          const newFile = new File([blob], fileToUpload.name || 'camera-photo.jpg', { type: inferredType });

          const uploaded = await uploadAttachment(newFile, 'GROUP_CHAT', groupId);
          fileId = uploaded.id;
          fileType = inferredType;
          fileName = newFile.name;
        } else {
          const uploaded = await uploadAttachment(fileToUpload, 'GROUP_CHAT', groupId);
          fileId = uploaded.id;
          fileType = fileToUpload.type || uploaded.contentType;
          fileName = fileToUpload.name;
        }

        console.log('File uploaded successfully:', { fileId, fileType, fileName });
      }

      const trimmedContent = messageInput.trim();
      const hasAttachment = Boolean(selectedFile);
      const isImageAttachment = fileType?.startsWith('image/') || false;
      const messageContent =
        trimmedContent || (hasAttachment ? (isImageAttachment ? '' : '📎 Archivo adjunto') : '');

      if (isConnected) {
        console.log('Sending message via WebSocket:', { content: messageContent, fileId, fileType, fileName });
        groupChannelService.sendMessage(groupId, {
          content: messageContent,
          fileId,
          fileType,
          fileName
        });
      } else {
        console.warn('Cannot send message: isConnected=', isConnected);
      }

      setMessageInput('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }

      setTimeout(() => refetchMessages(), 500);
    } catch (error) {
      console.error('Error sending message:', error);
      pushToast({
        type: 'error',
        title: 'Error al enviar',
        description: 'No se pudo enviar el mensaje. Intenta nuevamente.'
      });
    }
  };

  const handleReaction = async (messageId: number, emoji: string) => {
    try {
      const updated = await toggleReaction<GroupMessage>('GROUP_CHAT', messageId, emoji);
      upsertMessage(updated);
    } catch (error) {
      console.error('Error al reaccionar en el grupo', error);
      pushToast({
        type: 'error',
        title: 'No se pudo reaccionar',
        description: 'Intenta nuevamente.'
      });
    } finally {
      setReactionTarget(null);
    }
  };

  const downloadFile = async (message: GroupMessage) => {
    try {
      let blob: Blob | null = null;
      if (message.fileId) {
        blob = await downloadFileById(message.fileId);
      } else if (message.fileUrl) {
        const dataUrl = message.fileUrl.startsWith('data:')
          ? message.fileUrl
          : `data:${message.fileType || 'application/octet-stream'};base64,${message.fileUrl.includes(',') ? message.fileUrl.split(',')[1] : message.fileUrl
          }`;
        const response = await fetch(dataUrl);
        blob = await response.blob();
      }

      if (!blob) {
        throw new Error('Archivo no disponible');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = message.fileName || 'archivo';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      pushToast({
        type: 'error',
        title: 'Error al descargar',
        description: 'No se pudo descargar el archivo.'
      });
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <DocumentIcon className="h-5 w-5" />;
    if (fileType.startsWith('image/')) {
      return <PhotoIcon className="h-5 w-5" />;
    }
    if (fileType === 'application/pdf') {
      return <DocumentIcon className="h-5 w-5" />;
    }
    return <DocumentIcon className="h-5 w-5" />;
  };

  const getImageSource = (message: GroupMessage) => {
    // Priorizar stickerPreview si existe y no está vacío
    if (message.stickerPreview && message.stickerPreview.trim() !== '') {
      return `data:image/png;base64,${message.stickerPreview}`;
    }
    // Usar filePreview si existe y no está vacío
    if (message.filePreview && message.filePreview.trim() !== '') {
      return `data:${message.fileType || 'image/png'};base64,${message.filePreview}`;
    }
    // Si hay fileUrl, intentar usarlo
    if (message.fileUrl) {
      if (message.fileUrl.startsWith('data:')) {
        // Validar que la URL de data tenga contenido después de la coma
        const commaIndex = message.fileUrl.indexOf(',');
        if (commaIndex !== -1 && message.fileUrl.length > commaIndex + 1) {
          return message.fileUrl;
        }
        return undefined;
      }
      // Si es una URL relativa, usar directamente
      if (message.fileUrl.startsWith('/api/files/')) {
        return message.fileUrl;
      }
      // Intentar extraer base64 si está en el formato data:...
      const base64Data = message.fileUrl.includes(',') ? message.fileUrl.split(',')[1] : message.fileUrl;
      if (base64Data && base64Data.trim() !== '') {
        return `data:${message.fileType || 'image/png'};base64,${base64Data}`;
      }
    }
    return undefined;
  };

  const handleStickerSelect = (sticker: Sticker) => {
    if (!user || !canSend || !isConnected) return;
    groupChannelService.sendMessage(groupId, {
      content: '[Sticker]',
      stickerId: sticker.id
    });
  };

  const handleGroupCall = async () => {
    if (joiningCall) return;
    setJoiningCall(true);
    try {
      let session = await getActiveCall('GROUP', groupId);
      if (!session) {
        if (!canSend) {
          pushToast({ type: 'error', title: 'Sin permisos', description: 'Solo gestores del grupo pueden iniciar la llamada.' });
          return;
        }
        session = await createCallSession({ contextType: 'GROUP', contextId: groupId, mode: callMode });
      }
      setCurrentCall(session);
      setActiveCall(session);
    } catch (error: any) {
      pushToast({
        type: 'error',
        title: 'No se pudo iniciar la llamada',
        description: error?.response?.data?.message || 'Intenta nuevamente.'
      });
    } finally {
      setJoiningCall(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Organiza reuniones rápidas con los miembros del grupo.
          </p>
          <div className="flex items-center gap-3">
            {canSend && (
              <select
                value={callMode}
                onChange={(e) => setCallMode(e.target.value as CallMode)}
                className="text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1"
              >
                <option value="NORMAL">Modo normal (todos participan)</option>
                <option value="CONFERENCE">Conferencia (solo anfitrión habla)</option>
              </select>
            )}
            <button
              type="button"
              onClick={handleGroupCall}
              className="inline-flex items-center gap-2 rounded-full border border-primary-400 px-4 py-2 text-sm font-semibold text-primary-700 dark:text-primary-200"
              disabled={joiningCall}
            >
              <VideoCameraIcon className="h-4 w-4" />
              {joiningCall ? 'Conectando...' : activeCall ? 'Unirse a la llamada' : 'Llamada grupal'}
            </button>
          </div>
        </div>
        <div className="h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <p>No hay mensajes aún. {canSend ? 'Sé el primero en escribir!' : 'El administrador aún no ha enviado mensajes.'}</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <Avatar
                  user={{
                    name: msg.sender.name,
                    profilePictureUrl: msg.sender.profilePictureUrl
                  }}
                  size="sm"
                />
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {msg.sender.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    {(msg.fileUrl || msg.filePreview || msg.stickerPreview || msg.stickerId) && (
                      <div className="mb-2">
                        {(msg.fileType?.startsWith('image/') || msg.stickerId || msg.stickerPreview) ? (
                          <div className={`relative group ${msg.stickerId || msg.stickerPreview ? 'inline-block' : ''}`}>
                            <img
                              src={getImageSource(msg)}
                              alt={msg.fileName || 'Imagen'}
                              className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${msg.stickerId || msg.stickerPreview
                                ? 'h-32 w-32 object-contain' // Stickers: tamaño fijo pequeño (128px)
                                : 'max-w-full max-h-64' // Imágenes normales: tamaño flexible
                                }`}
                              onError={(e) => {
                                console.error('Error loading image:', {
                                  fileUrl: msg.fileUrl?.substring(0, 100),
                                  fileType: msg.fileType,
                                  fileName: msg.fileName
                                });
                                const img = e.target as HTMLImageElement;
                                const fallback = getImageSource(msg);
                                if (fallback) {
                                  img.src = fallback;
                                }
                              }}
                              onClick={() => {
                                const imgSrc = getImageSource(msg);
                                const newWindow = window.open();
                                if (newWindow && imgSrc) {
                                  newWindow.document.write(`<img src="${imgSrc}" style="max-width: 100%; height: auto;" />`);
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(msg);
                              }}
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Descargar imagen"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : msg.fileType === 'application/pdf' ? (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700">
                            <DocumentIcon className="h-8 w-8 text-red-500" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{msg.fileName || 'Documento PDF'}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">PDF</p>
                            </div>
                            <button
                              onClick={() => downloadFile(msg)}
                              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                              title="Descargar PDF"
                            >
                              <ArrowDownTrayIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                            {getFileIcon(msg.fileType)}
                            <span className="text-sm flex-1">{msg.fileName || 'Archivo'}</span>
                            <button
                              onClick={() => downloadFile(msg)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                              title="Descargar archivo"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.content && msg.content !== '[Sticker]' && !msg.stickerId && (
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    )}
                  </div>
                  <MessageReactions
                    reactions={msg.reactions}
                    currentUserId={user?.id}
                    onReact={(emoji) => handleReaction(msg.id, emoji)}
                  />
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setReactionTarget((prev) => (prev === msg.id ? null : msg.id))}
                      className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                      disabled={!user}
                    >
                      <FaceSmileIcon className="h-4 w-4" />
                    </button>
                    {reactionTarget === msg.id && (
                      <ReactionPicker onSelect={(emoji) => handleReaction(msg.id, emoji)} onClose={() => setReactionTarget(null)} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {canSend ? (
          <div className="space-y-2">
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                {selectedFile.preview ? (
                  <img src={selectedFile.preview} alt="Preview" className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {getFileIcon(selectedFile.file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {selectedFile.file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Seleccionar archivo"
                >
                  <PaperClipIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
                <input
                  ref={cameraInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Tomar foto"
                >
                  <CameraIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
                <StickerPicker onSelect={handleStickerSelect} />
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Escribe un mensaje..."
                className="input-field flex-1"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || (!messageInput.trim() && !selectedFile)}
                className="btn-primary"
              >
                Enviar
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span
                className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success-500 animate-pulse' : 'bg-slate-400'}`}
              />
              {isConnected ? 'Conectado' : 'Desconectado'}
              <span className="ml-2">• Solo imágenes y PDFs (máx. {MAX_FILE_SIZE_MB}MB)</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            Solo el administrador del grupo puede enviar mensajes.
          </div>
        )}
      </div>
      {currentCall && (
        <CallOverlay
          session={currentCall}
          onClose={() => {
            setCurrentCall(null);
            refreshActiveCall();
          }}
        />
      )}
    </>
  );
};

export default GroupChannelWindow;

