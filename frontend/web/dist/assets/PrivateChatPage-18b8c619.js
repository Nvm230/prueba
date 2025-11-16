var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { s as storage, t as tokenStorageKey, e as Client, S as SockJS, u as useAuth, g as useToast, r as reactExports, p as presenceService, j as jsxRuntimeExports, A as Avatar, X as XMarkIcon, h as useParams, l as useNavigate, L as LoadingOverlay, k as ChatBubbleLeftRightIcon, o as UserCircleIcon } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { h as getConversation, i as getConversations, a as getFriends } from "./socialService-5a59fc5f.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { A as ArrowDownTrayIcon, D as DocumentIcon, P as PaperClipIcon, C as CameraIcon } from "./PaperClipIcon-328e4719.js";
import { f as format } from "./index-40c20874.js";
import { P as PhotoIcon } from "./PhotoIcon-382c3ecc.js";
import "./utils-814f13d4.js";
const getWsBaseUrl = () => {
  const envUrl = {}.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const WS_BASE_URL = getWsBaseUrl();
class PrivateMessageService {
  constructor() {
    __publicField(this, "clients", /* @__PURE__ */ new Map());
  }
  connect(userId, onMessage, onError) {
    if (this.clients.has(userId)) {
      return () => this.disconnect(userId);
    }
    const token = storage.get(tokenStorageKey);
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
      },
      reconnectDelay: 5e3,
      heartbeatIncoming: 4e3,
      heartbeatOutgoing: 4e3,
      onConnect: () => {
        console.log(`[Private Message] Connected for user ${userId}`);
        client.subscribe(`/queue/private.${userId}`, (message) => {
          try {
            const privateMessage = JSON.parse(message.body);
            onMessage(privateMessage);
          } catch (error) {
            console.error("[Private Message] Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[Private Message] STOMP error:", frame);
        onError == null ? void 0 : onError(frame);
      },
      onWebSocketError: (event) => {
        console.error("[Private Message] WebSocket error:", event);
        onError == null ? void 0 : onError(event);
      }
    });
    client.activate();
    this.clients.set(userId, client);
    return () => this.disconnect(userId);
  }
  sendMessage(receiverId, message) {
    const client = Array.from(this.clients.values())[0];
    if (client && client.connected) {
      client.publish({
        destination: `/app/private.${receiverId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Private Message] Cannot send message: client not connected`);
    }
  }
  disconnect(userId) {
    const client = this.clients.get(userId);
    if (client) {
      client.deactivate();
      this.clients.delete(userId);
      console.log(`[Private Message] Disconnected for user ${userId}`);
    }
  }
  disconnectAll() {
    this.clients.forEach((client, userId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}
const privateMessageService = new PrivateMessageService();
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf"
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
const MAX_FILE_SIZE_MB = 10;
const PrivateChatWindow = ({
  otherUserId,
  otherUserName,
  otherUserProfilePicture
}) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [messageInput, setMessageInput] = reactExports.useState("");
  const [isConnected, setIsConnected] = reactExports.useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([]);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const cameraInputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["privateMessages", otherUserId],
    queryFn: ({ signal }) => getConversation(otherUserId, { page: 0, size: 100 }, signal),
    enabled: Boolean(otherUserId && user)
  });
  reactExports.useEffect(() => {
    if (savedMessages == null ? void 0 : savedMessages.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);
  reactExports.useEffect(() => {
    if (!otherUserId)
      return;
    presenceService.checkPresence(otherUserId).then((online) => {
      setIsOtherUserOnline(online);
    });
    const disconnectPresence = presenceService.connect((update) => {
      if (update.userId === otherUserId) {
        setIsOtherUserOnline(update.online);
      }
    });
    return () => {
      disconnectPresence();
    };
  }, [otherUserId]);
  reactExports.useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }
    const disconnect = privateMessageService.connect(
      user.id,
      (message) => {
        if (message.sender.id === otherUserId && message.receiver.id === user.id || message.sender.id === user.id && message.receiver.id === otherUserId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
        }
      },
      (error) => {
        console.error("Private chat error:", error);
        setIsConnected(false);
      }
    );
    setIsConnected(true);
    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [user, otherUserId]);
  reactExports.useEffect(() => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const validateFile = (file) => {
    var _a;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      const extension = "." + ((_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase());
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        pushToast({
          type: "error",
          title: "Tipo de archivo no permitido",
          description: "Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y PDFs."
        });
        return false;
      }
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      pushToast({
        type: "error",
        title: "Archivo demasiado grande",
        description: `El tamaño máximo es ${MAX_FILE_SIZE_MB}MB.`
      });
      return false;
    }
    return true;
  };
  const handleFileSelect = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file)
      return;
    if (!validateFile(file)) {
      if (event.target === fileInputRef.current) {
        fileInputRef.current.value = "";
      } else if (event.target === cameraInputRef.current) {
        cameraInputRef.current.value = "";
      }
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({ file });
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };
  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedFile || !user)
      return;
    try {
      let fileUrl;
      let fileType;
      let fileName;
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile.file);
        fileType = selectedFile.file.type;
        fileName = selectedFile.file.name;
      }
      const messageContent = messageInput.trim() || (selectedFile ? `📎 ${selectedFile.file.name}` : "");
      if (isConnected) {
        privateMessageService.sendMessage(otherUserId, {
          content: messageContent,
          fileUrl,
          fileType,
          fileName
        });
      }
      setMessageInput("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
      }
      setTimeout(() => refetchMessages(), 500);
    } catch (error) {
      console.error("Error sending message:", error);
      pushToast({
        type: "error",
        title: "Error al enviar",
        description: "No se pudo enviar el mensaje. Intenta nuevamente."
      });
    }
  };
  const downloadFile = (fileUrl, fileName, fileType) => {
    try {
      let dataUrl;
      if (fileUrl.startsWith("data:")) {
        dataUrl = fileUrl;
      } else {
        const base64Data = fileUrl.includes(",") ? fileUrl.split(",")[1] : fileUrl;
        dataUrl = `data:${fileType || "image/png"};base64,${base64Data}`;
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      pushToast({
        type: "error",
        title: "Error al descargar",
        description: "No se pudo descargar el archivo."
      });
    }
  };
  const getFileIcon = (fileType) => {
    if (!fileType)
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentIcon, { className: "h-5 w-5" });
    if (fileType.startsWith("image/")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoIcon, { className: "h-5 w-5" });
    }
    if (fileType === "application/pdf") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentIcon, { className: "h-5 w-5" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentIcon, { className: "h-5 w-5" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            user: {
              name: otherUserName,
              profilePictureUrl: otherUserProfilePicture
            },
            size: "md"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `absolute bottom-0 right-0 h-3 w-3 border-2 border-white dark:border-slate-900 rounded-full ${isOtherUserOnline ? "bg-success-500" : "bg-slate-400"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white", children: otherUserName }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50", children: [
      messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-slate-400 dark:text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No hay mensajes aún. ¡Comienza la conversación!" }) }) : messages.map((msg) => {
        var _a;
        const isOwn = msg.sender.id === (user == null ? void 0 : user.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`,
            children: [
              !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  user: {
                    name: msg.sender.name,
                    profilePictureUrl: msg.sender.profilePictureUrl
                  },
                  size: "sm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"}`,
                  children: [
                    !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: msg.sender.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `rounded-2xl px-4 py-2 ${isOwn ? "bg-primary-600 text-white" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"}`,
                        children: [
                          msg.fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: ((_a = msg.fileType) == null ? void 0 : _a.startsWith("image/")) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: (() => {
                                  if (msg.fileUrl.startsWith("data:")) {
                                    return msg.fileUrl;
                                  }
                                  const base64Data = msg.fileUrl.includes(",") ? msg.fileUrl.split(",")[1] : msg.fileUrl;
                                  return `data:${msg.fileType || "image/png"};base64,${base64Data}`;
                                })(),
                                alt: msg.fileName || "Imagen",
                                className: "max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity",
                                onError: (e) => {
                                  var _a2;
                                  console.error("Error loading image:", {
                                    fileUrl: (_a2 = msg.fileUrl) == null ? void 0 : _a2.substring(0, 100),
                                    fileType: msg.fileType,
                                    fileName: msg.fileName
                                  });
                                  const img = e.target;
                                  const base64Data = msg.fileUrl.includes(",") ? msg.fileUrl.split(",")[1] : msg.fileUrl;
                                  img.src = `data:${msg.fileType || "image/png"};base64,${base64Data}`;
                                },
                                onClick: () => {
                                  const imgSrc = msg.fileUrl.startsWith("data:") ? msg.fileUrl : `data:${msg.fileType || "image/png"};base64,${msg.fileUrl.includes(",") ? msg.fileUrl.split(",")[1] : msg.fileUrl}`;
                                  const newWindow = window.open();
                                  if (newWindow) {
                                    newWindow.document.write(`<img src="${imgSrc}" style="max-width: 100%; height: auto;" />`);
                                  }
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  downloadFile(msg.fileUrl, msg.fileName || "imagen.png", msg.fileType);
                                },
                                className: "absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                title: "Descargar imagen",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownTrayIcon, { className: "h-4 w-4" })
                              }
                            )
                          ] }) : msg.fileType === "application/pdf" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-700", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentIcon, { className: "h-8 w-8 text-red-500" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: msg.fileName || "Documento PDF" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "PDF" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: () => downloadFile(msg.fileUrl, msg.fileName || "documento.pdf", msg.fileType),
                                className: "p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors",
                                title: "Descargar PDF",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownTrayIcon, { className: "h-5 w-5" })
                              }
                            )
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700", children: [
                            getFileIcon(msg.fileType),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm flex-1", children: msg.fileName || "Archivo" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: () => downloadFile(msg.fileUrl, msg.fileName || "archivo", msg.fileType),
                                className: "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600",
                                title: "Descargar archivo",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownTrayIcon, { className: "h-4 w-4" })
                              }
                            )
                          ] }) }),
                          msg.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words", children: msg.content }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-70 mt-1", children: format(new Date(msg.createdAt), "HH:mm") })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          },
          msg.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800", children: [
      selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-700", children: [
        selectedFile.preview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedFile.preview, alt: "Preview", className: "h-12 w-12 rounded object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center", children: getFileIcon(selectedFile.file.type) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white truncate", children: selectedFile.file.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
            (selectedFile.file.size / 1024).toFixed(1),
            " KB"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleRemoveFile,
            className: "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(XMarkIcon, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              onChange: handleFileSelect,
              className: "hidden",
              accept: "image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: "p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
              title: "Seleccionar archivo",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaperClipIcon, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: cameraInputRef,
              type: "file",
              onChange: handleFileSelect,
              className: "hidden",
              accept: "image/*",
              capture: "environment"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = cameraInputRef.current) == null ? void 0 : _a.click();
              },
              className: "p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
              title: "Tomar foto",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CameraIcon, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: messageInput,
            onChange: (e) => setMessageInput(e.target.value),
            onKeyPress: (e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(),
            placeholder: "Escribe un mensaje...",
            className: "input-field flex-1",
            disabled: !isConnected
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSendMessage,
            disabled: !isConnected || !messageInput.trim() && !selectedFile,
            className: "btn-primary",
            children: "Enviar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-2", children: [
        "Solo imágenes y PDFs (máx. ",
        MAX_FILE_SIZE_MB,
        "MB)"
      ] })
    ] })
  ] });
};
const PrivateChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  useAuth();
  const [onlineUsers, setOnlineUsers] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    const disconnectPresence = presenceService.connect((update) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (update.online) {
          next.add(update.userId);
        } else {
          next.delete(update.userId);
        }
        return next;
      });
    });
    return () => {
      disconnectPresence();
    };
  }, []);
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: ({ signal }) => getConversations(signal)
  });
  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: ({ signal }) => getFriends(signal),
    onSuccess: (friends2) => {
      friends2 == null ? void 0 : friends2.forEach((friend) => {
        presenceService.checkPresence(friend.id).then((online) => {
          if (online) {
            setOnlineUsers((prev) => new Set(prev).add(friend.id));
          }
        });
      });
    }
  });
  const selectedFriend = friends == null ? void 0 : friends.find((f) => f.id === Number(userId));
  if (conversationsLoading || friendsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando conversaciones" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Chat" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChatBubbleLeftRightIcon, { className: "h-6 w-6 text-primary-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Conversaciones" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-[600px] overflow-y-auto", children: !friends || friends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Sin amigos",
            description: "Agrega amigos para comenzar a chatear.",
            className: "py-8"
          }
        ) : friends.map((friend) => {
          const conversation = conversations == null ? void 0 : conversations.find((c) => c.userId === friend.id);
          const isSelected = Number(userId) === friend.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate(`/chat/${friend.id}`),
              className: `w-full text-left p-3 rounded-lg transition-colors ${isSelected ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Avatar,
                    {
                      user: {
                        name: friend.name,
                        profilePictureUrl: friend.profilePictureUrl
                      },
                      size: "sm"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white dark:border-slate-900 rounded-full ${onlineUsers.has(friend.id) ? "bg-success-500" : "bg-slate-400"}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-slate-900 dark:text-white truncate", children: friend.name }),
                  conversation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: [
                    conversation.unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white text-xs mr-1", children: conversation.unreadCount }),
                    "Ver conversación"
                  ] })
                ] })
              ] })
            },
            friend.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3", children: !userId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card h-[600px] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCircleIcon, { className: "h-16 w-16 text-slate-400 mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white mb-2", children: "Selecciona una conversación" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Elige un amigo de la lista para comenzar a chatear" })
      ] }) }) : !selectedFriend ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando conversación" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        PrivateChatWindow,
        {
          otherUserId: selectedFriend.id,
          otherUserName: selectedFriend.name,
          otherUserProfilePicture: selectedFriend.profilePictureUrl
        }
      ) })
    ] })
  ] });
};
export {
  PrivateChatPage as default
};
