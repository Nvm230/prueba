import { useState, useEffect, useRef } from 'react';
import { chatService, ChatMessage, fetchChatMessages } from '@/services/chatService';
import { useAuth } from '@/hooks/useAuth';
import Avatar from '@/components/display/Avatar';
import { PaperClipIcon, PhotoIcon, DocumentIcon, XMarkIcon, CameraIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';

interface ChatWindowProps {
  eventId: number;
  eventStatus: string;
  isLive: boolean;
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

const ChatWindow: React.FC<ChatWindowProps> = ({ eventId, eventStatus, isLive }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [chatInput, setChatInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes guardados (siempre, incluso si el evento terminó)
  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['chatMessages', eventId],
    queryFn: ({ signal }) => fetchChatMessages(eventId, { page: 0, size: 100 }, signal),
    enabled: Boolean(eventId)
  });

  // Sincronizar mensajes guardados con el estado local
  useEffect(() => {
    if (savedMessages?.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);

  // Conectar WebSocket solo si el evento está LIVE
  useEffect(() => {
    if (!isLive || !user) {
      setIsConnected(false);
      return;
    }

    const disconnect = chatService.connect(
      eventId,
      (message: ChatMessage) => {
        setMessages((prev) => {
          // Evitar duplicados
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      },
      (error) => {
        console.error('Chat error:', error);
        setIsConnected(false);
      }
    );

    setIsConnected(true);

    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [isLive, eventId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const validateFile = (file: File): boolean => {
    // Validar tipo
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

    // Validar tamaño
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

    // Si es imagen, crear preview
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
    // Convertir a base64
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
    if ((!chatInput.trim() && !selectedFile) || !user) return;

    try {
      let fileUrl: string | undefined;
      let fileType: string | undefined;
      let fileName: string | undefined;

      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile.file);
        fileType = selectedFile.file.type;
        fileName = selectedFile.file.name;
      }

      const messageContent = chatInput.trim() || (selectedFile ? `📎 ${selectedFile.file.name}` : '');

      if (isLive && isConnected) {
        // Enviar por WebSocket si está LIVE
        chatService.sendMessage(eventId, {
          content: messageContent,
          fileUrl,
          fileType,
          fileName
        });
      }

      setChatInput('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = '';
      }

      // Refrescar mensajes guardados
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
      // Asegurar que el fileUrl tenga el prefijo data: si es base64
      let dataUrl: string;
      if (fileUrl.startsWith('data:')) {
        dataUrl = fileUrl;
      } else {
        // Si tiene coma, extraer solo la parte base64
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
    <div className="space-y-4">
      <div className="h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
            <p>
              {isLive
                ? 'No hay mensajes aún. ¡Sé el primero en escribir!'
                : 'Este evento ha finalizado. Aquí puedes ver el historial de mensajes.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.user?.id === user?.id ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.user && (
                <Avatar
                  user={{
                    name: msg.user.name,
                    profilePictureUrl: msg.user.profilePictureUrl
                  }}
                  size="sm"
                />
              )}
              <div
                className={`flex flex-col gap-1 max-w-[70%] ${
                  msg.user?.id === user?.id ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {msg.user?.name || 'Usuario'}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {format(new Date(msg.createdAt), 'HH:mm')}
                  </span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.user?.id === user?.id
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
                              // Abrir imagen en nueva ventana
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
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {isLive ? (
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
              {/* Input para seleccionar archivo */}
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
              {/* Input para tomar foto con cámara */}
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
            </div>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="input-field flex-1"
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || (!chatInput.trim() && !selectedFile)}
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
          El chat está cerrado. Este evento ha finalizado.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
