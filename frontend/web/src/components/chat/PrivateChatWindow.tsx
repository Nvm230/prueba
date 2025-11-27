import { useState, useEffect, useRef, useCallback } from 'react';
import { privateMessageService, PrivateMessageRequest } from '@/services/privateMessageService';
import { getConversation, PrivateMessage, markConversationAsRead } from '@/services/socialService';
import { markMessageNotificationsAsRead } from '@/services/notificationService';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/display/Avatar';
import {
  PaperClipIcon,
  PhotoIcon,
  DocumentIcon,
  XMarkIcon,
  CameraIcon,
  ArrowDownTrayIcon,
  VideoCameraIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { presenceService, PresenceUpdate } from '@/services/presenceService';
import { uploadFile as uploadAttachment, downloadFileById } from '@/services/fileService';
import StickerPicker from './StickerPicker';
import { Sticker } from '@/services/stickerService';
import { createCallSession, getActiveCall, CallSession, CallMode, acceptCallSession } from '@/services/callService';
import CallOverlay from './CallOverlay';
import ReactionPicker from './ReactionPicker';
import MessageReactions from './MessageReactions';
import { toggleReaction } from '@/services/messageReactionService';

interface PrivateChatWindowProps {
  otherUserId: number;
  otherUserName: string;
  otherUserProfilePicture?: string;
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

const PrivateChatWindow: React.FC<PrivateChatWindowProps> = ({
  otherUserId,
  otherUserName,
  otherUserProfilePicture
}) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview?: string } | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [joiningCall, setJoiningCall] = useState(false);

  const upsertMessage = useCallback((updated: PrivateMessage) => {
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

  const { data: savedMessages, refetch: refetchMessages, error: messagesError, isLoading: messagesLoading } = useQuery({
    queryKey: ['privateMessages', otherUserId],
    queryFn: ({ signal }) => getConversation(otherUserId, { page: 0, size: 100 }, signal),
    enabled: Boolean(otherUserId && user),
    retry: 2,
    staleTime: 0 // Siempre refetch al montar
  });

  // Actualizar contador cuando se carga la conversación por primera vez y marcar notificaciones como leídas
  const lastOtherUserIdRef = useRef<number | null>(null);
  const hasUpdatedRef = useRef(false);
  useEffect(() => {
    // Solo actualizar cuando cambia la conversación y se carga por primera vez
    if (otherUserId !== lastOtherUserIdRef.current) {
      lastOtherUserIdRef.current = otherUserId;
      hasUpdatedRef.current = false;
    }

    // Marcar notificaciones como leídas cuando se carga la conversación (incluso si no hay mensajes)
    if (!hasUpdatedRef.current && savedMessages !== undefined && user) {
      hasUpdatedRef.current = true;

      // Llamar explícitamente al endpoint para marcar la conversación como leída
      markConversationAsRead(otherUserId)
        .then((result) => {
          console.log('[PrivateChat] Marked conversation as read:', result);
          // Invalidar y refrescar inmediatamente
          queryClient.invalidateQueries({ queryKey: ['unread-messages-count', user.id] });
          queryClient.refetchQueries({ queryKey: ['conversations'] });
        })
        .catch((error) => {
          console.error('[PrivateChat] Error marking conversation as read:', error);
        });

      // Marcar notificaciones de mensajes de este usuario como leídas
      markMessageNotificationsAsRead(otherUserName)
        .then(() => {
          // Invalidar notificaciones para actualizar la UI
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
          // Refrescar conversaciones nuevamente después de marcar notificaciones
          queryClient.refetchQueries({ queryKey: ['conversations'] });
        })
        .catch((error) => {
          console.error('Error marking message notifications as read:', error);
        });
    }
  }, [otherUserId, savedMessages, queryClient, user, otherUserName]);

  // Sincronizar mensajes guardados con el estado local
  useEffect(() => {
    if (messagesError) {
      console.error('[PrivateChat] Error loading messages:', messagesError);
      return;
    }
    if (savedMessages?.content) {
      console.log('[PrivateChat] Loading messages:', savedMessages.content.length, 'messages');
      setMessages(savedMessages.content);
    } else if (savedMessages && !savedMessages.content) {
      console.warn('[PrivateChat] No content in savedMessages:', savedMessages);
      setMessages([]);
    } else if (!messagesLoading && savedMessages === undefined) {
      console.warn('[PrivateChat] savedMessages is undefined');
    }
  }, [savedMessages, messagesError, messagesLoading]);

  // Verificar estado de presencia del otro usuario
  useEffect(() => {
    if (!otherUserId) return;

    // Verificar estado inicial
    presenceService.checkPresence(otherUserId).then((online) => {
      setIsOtherUserOnline(online);
    });

    // Suscribirse a actualizaciones de presencia
    const disconnectPresence = presenceService.connect((update: PresenceUpdate) => {
      if (update.userId === otherUserId) {
        setIsOtherUserOnline(update.online);
      }
    });

    return () => {
      disconnectPresence();
    };
  }, [otherUserId]);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const disconnect = privateMessageService.connect(
      user.id,
      (message: PrivateMessage) => {
        if (
          (message.sender.id === otherUserId && message.receiver.id === user.id) ||
          (message.sender.id === user.id && message.receiver.id === otherUserId)
        ) {
          upsertMessage(message);

          // Si es un mensaje recibido (no enviado por mí), actualizar contador de mensajes sin leer
          if (message.receiver.id === user.id && message.sender.id === otherUserId) {
            // Invalidar el contador y refrescar inmediatamente las conversaciones
            queryClient.invalidateQueries({ queryKey: ['unread-messages-count', user.id] });
            queryClient.refetchQueries({ queryKey: ['conversations'] });
          }
        }
      },
      (error) => {
        console.error('Private chat error:', error);
        setIsConnected(false);
      }
    );

    setIsConnected(true);

    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [otherUserId, queryClient, upsertMessage, user]);

  const refreshActiveCall = useCallback(async () => {
    try {
      let active = await getActiveCall('PRIVATE', otherUserId);
      if (!active && user) {
        active = await getActiveCall('PRIVATE', user.id);
      }
      setActiveCall(active);
    } catch (error) {
      console.error('No se pudo verificar llamadas activas', error);
    }
  }, [otherUserId, user]);

  useEffect(() => {
    refreshActiveCall();
  }, [refreshActiveCall]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    if ((!messageInput.trim() && !selectedFile) || !user) return;

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

          const uploaded = await uploadAttachment(newFile, 'PRIVATE_CHAT', otherUserId);
          fileId = uploaded.id;
          fileType = inferredType;
          fileName = newFile.name;
        } else {
          const uploaded = await uploadAttachment(fileToUpload, 'PRIVATE_CHAT', otherUserId);
          fileId = uploaded.id;
          fileType = fileToUpload.type || uploaded.contentType;
          fileName = fileToUpload.name;
        }

        console.log('File uploaded successfully:', { fileId, fileType, fileName });
      }

      const trimmedContent = messageInput.trim();
      const hasAttachment = Boolean(selectedFile);
      const isImageAttachment = selectedFile ? (selectedFile.file.type.startsWith('image/') || fileType?.startsWith('image/')) : false;
      const messageContent =
        trimmedContent || (hasAttachment ? (isImageAttachment ? '' : '📎 Archivo adjunto') : '');

      if (isConnected) {
        console.log('Sending message via WebSocket:', { content: messageContent, fileId, fileType, fileName });
        privateMessageService.sendMessage(otherUserId, {
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
        description: 'No se pudo enviar el mensaje. Intenta nuevamente.'
      });
    }
  };

  const downloadFile = async (message: PrivateMessage) => {
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

  const getImageSource = (message: PrivateMessage) => {
    // Priorizar stickerPreview si existe y no está vacío
    if (message.stickerPreview && message.stickerPreview.trim() !== '') {
      return `data:image/png;base64,${message.stickerPreview}`;
    }
    // Usar filePreview si existe y no está vacío
    if (message.filePreview && message.filePreview.trim() !== '') {
      // Si el filePreview parece estar escapado (contiene \\x), intentar decodificarlo
      let preview = message.filePreview;
      // Verificar si es un string escapado de PostgreSQL (formato \x...)
      if (preview.startsWith('\\x')) {
        try {
          // Remover el prefijo \x y convertir de hex a string
          const hexString = preview.substring(2); // Remover \x
          const bytes = new Uint8Array(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
          preview = new TextDecoder().decode(bytes);
        } catch (e) {
          console.warn('Error decoding filePreview hex:', e);
          // Si falla, intentar usar directamente
        }
      }
      // Validar que el preview no esté vacío y no sea solo caracteres de escape
      if (preview && preview.trim() !== '' && !preview.startsWith('\\x')) {
        return `data:${message.fileType || 'image/png'};base64,${preview}`;
      }
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
      // Si es una URL relativa, usar directamente (el navegador la resolverá correctamente)
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
    if (!user || !isConnected) {
      pushToast({
        type: 'error',
        title: 'No conectado',
        description: 'No se puede enviar el sticker. Intenta recargar la página.'
      });
      return;
    }
    try {
      privateMessageService.sendMessage(otherUserId, {
        content: '[Sticker]',
        stickerId: sticker.id
      });
      // Refrescar mensajes después de un breve delay para que el backend procese
      setTimeout(() => refetchMessages(), 500);
    } catch (error) {
      console.error('Error sending sticker:', error);
      pushToast({
        type: 'error',
        title: 'Error al enviar',
        description: 'No se pudo enviar el sticker. Intenta nuevamente.'
      });
    }
  };

  const handleJoinCall = async () => {
    if (joiningCall) return;
    setJoiningCall(true);
    try {
      let session = await getActiveCall('PRIVATE', otherUserId);
      if (!session && user) {
        session = await getActiveCall('PRIVATE', user.id);
      }
      if (!session) {
        session = await createCallSession({
          contextType: 'PRIVATE',
          contextId: otherUserId,
          mode: 'NORMAL'
        });
      } else if (session.createdById !== user?.id) {
        session = await acceptCallSession(session.id);
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

  const handleReaction = async (messageId: number, emoji: string) => {
    try {
      const updated = await toggleReaction<PrivateMessage>('PRIVATE_CHAT', messageId, emoji);
      upsertMessage(updated);
    } catch (error) {
      console.error('No se pudo reaccionar', error);
      pushToast({
        type: 'error',
        title: 'Error al reaccionar',
        description: 'Intenta nuevamente.'
      });
    } finally {
      setReactionTarget(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          <div className="relative">
            <Avatar
              user={{
                name: otherUserName,
                profilePictureUrl: otherUserProfilePicture
              }}
              size="md"
            />
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 border-2 border-white dark:border-slate-900 rounded-full ${isOtherUserOnline ? 'bg-success-500' : 'bg-slate-400'
                }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{otherUserName}</h3>
          </div>
          <button
            type="button"
            onClick={handleJoinCall}
            className="inline-flex items-center gap-2 rounded-full border border-primary-400 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-primary-100 hover:bg-primary-500/20 disabled:opacity-60"
            disabled={joiningCall}
          >
            <VideoCameraIcon className="h-4 w-4" />
            {joiningCall ? 'Conectando...' : activeCall ? 'Unirse a la llamada' : 'Videollamada'}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
              <p>No hay mensajes aún. ¡Comienza la conversación!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender.id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isOwn && (
                    <Avatar
                      user={{
                        name: msg.sender.name,
                        profilePictureUrl: msg.sender.profilePictureUrl
                      }}
                      size="sm"
                    />
                  )}
                  <div
                    className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`rounded-2xl ${(msg.stickerId || msg.stickerPreview)
                        ? 'px-1 py-1' // Stickers: padding mínimo
                        : 'px-4 py-2' // Mensajes normales: padding normal
                        } ${isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                        }`}
                    >
                      {(msg.fileUrl || msg.filePreview || msg.stickerPreview || msg.stickerId) && (() => {
                        const imageSrc = getImageSource(msg);
                        if (!imageSrc) {
                          // Si no hay fuente válida, mostrar un placeholder o el fileUrl como fallback
                          if (msg.fileUrl && msg.fileUrl.startsWith('/api/files/')) {
                            return (
                              <div className="mb-2">
                                <img
                                  src={msg.fileUrl}
                                  alt={msg.fileName || 'Imagen'}
                                  className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  onError={(e) => {
                                    console.error('Error loading image from API:', msg.fileUrl);
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                  }}
                                />
                              </div>
                            );
                          }
                          return null;
                        }
                        return (
                          <div className="mb-2">
                            {(msg.fileType?.startsWith('image/') || msg.stickerId || msg.stickerPreview) ? (
                              <div className={`relative group ${msg.stickerId || msg.stickerPreview ? 'inline-block' : ''}`}>
                                <img
                                  src={imageSrc}
                                  alt={msg.fileName || 'Imagen'}
                                  className={`rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${msg.stickerId || msg.stickerPreview
                                    ? 'h-32 w-32 object-contain' // Stickers: tamaño fijo pequeño (128px)
                                    : 'max-w-full max-h-64' // Imágenes normales: tamaño flexible
                                    }`}
                                  onError={(e) => {
                                    console.error('Error loading image:', {
                                      fileUrl: msg.fileUrl?.substring(0, 100),
                                      fileType: msg.fileType,
                                      fileName: msg.fileName,
                                      stickerPreview: msg.stickerPreview ? `${msg.stickerPreview.substring(0, 20)}...` : null,
                                      filePreview: msg.filePreview ? `${msg.filePreview.substring(0, 20)}...` : null
                                    });
                                    const img = e.target as HTMLImageElement;
                                    // No intentar cargar desde /api/files/ si ya tenemos filePreview (evitar 401)
                                    // Solo ocultar la imagen si falla
                                    img.style.display = 'none';
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
                        );
                      })()}
                      {msg.content && msg.content !== '[Sticker]' && !msg.stickerId && (
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      )}
                      <span className="text-xs opacity-70 mt-1">
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                    <MessageReactions
                      reactions={msg.reactions}
                      currentUserId={user?.id}
                      onReact={(emoji) => handleReaction(msg.id, emoji)}
                    />
                    <div className={`relative mt-1 ${isOwn ? 'self-end' : 'self-start'}`}>
                      <button
                        type="button"
                        onClick={() => setReactionTarget((prev) => (prev === msg.id ? null : msg.id))}
                        className="rounded-full p-1.5 text-white/80 hover:bg-white/20"
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
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          {selectedFile && (
            <div className="mb-2 flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
              {selectedFile.preview ? (
                <img src={selectedFile.preview} alt="Preview" className="h-12 w-12 rounded object-cover" />
              ) : (
                <div className="h-12 w-12 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
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
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
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
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Solo imágenes y PDFs (máx. {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
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

export default PrivateChatWindow;

