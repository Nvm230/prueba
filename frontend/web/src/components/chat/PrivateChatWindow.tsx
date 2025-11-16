import { useState, useEffect, useRef } from 'react';
import { privateMessageService, PrivateMessageRequest } from '@/services/privateMessageService';
import { getConversation, PrivateMessage } from '@/services/socialService';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/display/Avatar';
import { PaperClipIcon, PhotoIcon, DocumentIcon, XMarkIcon, CameraIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { presenceService, PresenceUpdate } from '@/services/presenceService';

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
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['privateMessages', otherUserId],
    queryFn: ({ signal }) => getConversation(otherUserId, { page: 0, size: 100 }, signal),
    enabled: Boolean(otherUserId && user)
  });

  // Sincronizar mensajes guardados con el estado local
  useEffect(() => {
    if (savedMessages?.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);

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
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
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
  }, [user, otherUserId]);

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

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedFile) || !user) return;

    try {
      let fileUrl: string | undefined;
      let fileType: string | undefined;
      let fileName: string | undefined;

      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile.file);
        fileType = selectedFile.file.type;
        fileName = selectedFile.file.name;
      }

      const messageContent = messageInput.trim() || (selectedFile ? `📎 ${selectedFile.file.name}` : '');

      if (isConnected) {
        privateMessageService.sendMessage(otherUserId, {
          content: messageContent,
          fileUrl,
          fileType,
          fileName
        });
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

  const downloadFile = (fileUrl: string, fileName: string, fileType?: string) => {
    try {
      let dataUrl: string;
      if (fileUrl.startsWith('data:')) {
        dataUrl = fileUrl;
      } else {
        const base64Data = fileUrl.includes(',') ? fileUrl.split(',')[1] : fileUrl;
        dataUrl = `data:${fileType || 'image/png'};base64,${base64Data}`;
      }
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
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

  return (
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
            className={`absolute bottom-0 right-0 h-3 w-3 border-2 border-white dark:border-slate-900 rounded-full ${
              isOtherUserOnline ? 'bg-success-500' : 'bg-slate-400'
            }`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{otherUserName}</h3>
        </div>
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
                  {!isOwn && (
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {msg.sender.name}
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    {msg.fileUrl && (
                      <div className="mb-2">
                        {msg.fileType?.startsWith('image/') ? (
                          <div className="relative group">
                            <img
                              src={(() => {
                                // Si ya tiene el prefijo data:, usarlo directamente
                                if (msg.fileUrl.startsWith('data:')) {
                                  return msg.fileUrl;
                                }
                                // Si no tiene prefijo, agregarlo
                                const base64Data = msg.fileUrl.includes(',') ? msg.fileUrl.split(',')[1] : msg.fileUrl;
                                return `data:${msg.fileType || 'image/png'};base64,${base64Data}`;
                              })()}
                              alt={msg.fileName || 'Imagen'}
                              className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onError={(e) => {
                                console.error('Error loading image:', {
                                  fileUrl: msg.fileUrl?.substring(0, 100),
                                  fileType: msg.fileType,
                                  fileName: msg.fileName
                                });
                                // Intentar diferentes formatos
                                const img = e.target as HTMLImageElement;
                                const base64Data = msg.fileUrl.includes(',') ? msg.fileUrl.split(',')[1] : msg.fileUrl;
                                img.src = `data:${msg.fileType || 'image/png'};base64,${base64Data}`;
                              }}
                              onClick={() => {
                                const imgSrc = msg.fileUrl.startsWith('data:') 
                                  ? msg.fileUrl 
                                  : `data:${msg.fileType || 'image/png'};base64,${msg.fileUrl.includes(',') ? msg.fileUrl.split(',')[1] : msg.fileUrl}`;
                                const newWindow = window.open();
                                if (newWindow) {
                                  newWindow.document.write(`<img src="${imgSrc}" style="max-width: 100%; height: auto;" />`);
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(msg.fileUrl!, msg.fileName || 'imagen.png', msg.fileType);
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
                              onClick={() => downloadFile(msg.fileUrl!, msg.fileName || 'documento.pdf', msg.fileType)}
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
                              onClick={() => downloadFile(msg.fileUrl!, msg.fileName || 'archivo', msg.fileType)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                              title="Descargar archivo"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.content && <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>}
                    <span className="text-xs opacity-70 mt-1">
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
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
  );
};

export default PrivateChatWindow;

