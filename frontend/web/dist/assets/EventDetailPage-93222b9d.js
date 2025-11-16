var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { r as reactExports, s as storage, t as tokenStorageKey, e as Client, S as SockJS, f as apiClient, u as useAuth, g as useToast, j as jsxRuntimeExports, A as Avatar, X as XMarkIcon, h as useParams, i as useQueryClient, L as LoadingOverlay, Q as QrCodeIcon, k as ChatBubbleLeftRightIcon } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { S as StatusBadge } from "./StatusBadge-acb5659e.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { f as format } from "./index-40c20874.js";
import { A as ArrowDownTrayIcon, D as DocumentIcon, P as PaperClipIcon, C as CameraIcon } from "./PaperClipIcon-328e4719.js";
import { P as PhotoIcon } from "./PhotoIcon-382c3ecc.js";
import { a as fetchEventDetail, s as startEvent, b as finishEvent } from "./eventService-3ce97835.js";
import { r as registerForEvent } from "./registrationService-2550b869.js";
import { f as formatDateTime } from "./formatters-dc58be6b.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import { M as MapPinIcon, C as ClockIcon } from "./MapPinIcon-0b58321d.js";
import "./utils-814f13d4.js";
function CalendarIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
  }));
}
const ForwardRef$3 = /* @__PURE__ */ reactExports.forwardRef(CalendarIcon);
const CalendarIcon$1 = ForwardRef$3;
function CloudArrowUpIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
  }));
}
const ForwardRef$2 = /* @__PURE__ */ reactExports.forwardRef(CloudArrowUpIcon);
const CloudArrowUpIcon$1 = ForwardRef$2;
function PlayIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(PlayIcon);
const PlayIcon$1 = ForwardRef$1;
function StopIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(StopIcon);
const StopIcon$1 = ForwardRef;
const getWsBaseUrl = () => {
  const envUrl = {}.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const WS_BASE_URL = getWsBaseUrl();
class ChatService {
  constructor() {
    __publicField(this, "clients", /* @__PURE__ */ new Map());
  }
  connect(eventId, onMessage, onError) {
    if (this.clients.has(eventId)) {
      return () => this.disconnect(eventId);
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
        console.log(`[Chat] Connected to event ${eventId}`);
        client.subscribe(`/topic/events.${eventId}`, (message) => {
          try {
            const chatMessage = JSON.parse(message.body);
            onMessage(chatMessage);
          } catch (error) {
            console.error("[Chat] Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[Chat] STOMP error:", frame);
        onError == null ? void 0 : onError(frame);
      },
      onWebSocketError: (event) => {
        console.error("[Chat] WebSocket error:", event);
        onError == null ? void 0 : onError(event);
      }
    });
    client.activate();
    this.clients.set(eventId, client);
    return () => this.disconnect(eventId);
  }
  sendMessage(eventId, message) {
    const client = this.clients.get(eventId);
    if (client && client.connected) {
      client.publish({
        destination: `/app/chat.${eventId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Chat] Cannot send message: client not connected for event ${eventId}`);
    }
  }
  disconnect(eventId) {
    const client = this.clients.get(eventId);
    if (client) {
      client.deactivate();
      this.clients.delete(eventId);
      console.log(`[Chat] Disconnected from event ${eventId}`);
    }
  }
  disconnectAll() {
    this.clients.forEach((client, eventId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}
const chatService = new ChatService();
const fetchChatMessages = (eventId, filters, signal) => apiClient.get(`/api/chat/events/${eventId}/messages`, {
  params: filters,
  signal
}).then((res) => res.data);
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
const ChatWindow = ({ eventId, eventStatus, isLive }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [chatInput, setChatInput] = reactExports.useState("");
  const [isConnected, setIsConnected] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([]);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const cameraInputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["chatMessages", eventId],
    queryFn: ({ signal }) => fetchChatMessages(eventId, { page: 0, size: 100 }, signal),
    enabled: Boolean(eventId)
  });
  reactExports.useEffect(() => {
    if (savedMessages == null ? void 0 : savedMessages.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);
  reactExports.useEffect(() => {
    if (!isLive || !user) {
      setIsConnected(false);
      return;
    }
    const disconnect = chatService.connect(
      eventId,
      (message) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      },
      (error) => {
        console.error("Chat error:", error);
        setIsConnected(false);
      }
    );
    setIsConnected(true);
    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [isLive, eventId, user]);
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
    if (!chatInput.trim() && !selectedFile || !user)
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
      const messageContent = chatInput.trim() || (selectedFile ? `📎 ${selectedFile.file.name}` : "");
      if (isLive && isConnected) {
        chatService.sendMessage(eventId, {
          content: messageContent,
          fileUrl,
          fileType,
          fileName
        });
      }
      setChatInput("");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 overflow-y-auto flex flex-col gap-3", children: [
      messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-slate-400 dark:text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isLive ? "No hay mensajes aún. ¡Sé el primero en escribir!" : "Este evento ha finalizado. Aquí puedes ver el historial de mensajes." }) }) : messages.map((msg) => {
        var _a, _b, _c, _d, _e;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex gap-3 ${((_a = msg.user) == null ? void 0 : _a.id) === (user == null ? void 0 : user.id) ? "flex-row-reverse" : "flex-row"}`,
            children: [
              msg.user && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  user: {
                    name: msg.user.name,
                    profilePictureUrl: msg.user.profilePictureUrl
                  },
                  size: "sm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `flex flex-col gap-1 max-w-[70%] ${((_b = msg.user) == null ? void 0 : _b.id) === (user == null ? void 0 : user.id) ? "items-end" : "items-start"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: ((_c = msg.user) == null ? void 0 : _c.name) || "Usuario" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 dark:text-slate-500", children: format(new Date(msg.createdAt), "HH:mm") })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `rounded-2xl px-4 py-2 ${((_d = msg.user) == null ? void 0 : _d.id) === (user == null ? void 0 : user.id) ? "bg-primary-600 text-white" : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white"}`,
                        children: [
                          msg.fileUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2", children: ((_e = msg.fileType) == null ? void 0 : _e.startsWith("image/")) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
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
                          msg.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words", children: msg.content })
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
    isLive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800", children: [
        selectedFile.preview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selectedFile.preview, alt: "Preview", className: "h-12 w-12 rounded object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center", children: getFileIcon(selectedFile.file.type) }),
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
            className: "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700",
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
              className: "p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
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
              className: "p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
              title: "Tomar foto",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CameraIcon, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: chatInput,
            onChange: (e) => setChatInput(e.target.value),
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
            disabled: !isConnected || !chatInput.trim() && !selectedFile,
            className: "btn-primary",
            children: "Enviar"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `h-2 w-2 rounded-full ${isConnected ? "bg-success-500 animate-pulse" : "bg-slate-400"}`
          }
        ),
        isConnected ? "Conectado" : "Desconectado",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2", children: [
          "• Solo imágenes y PDFs (máx. ",
          MAX_FILE_SIZE_MB,
          "MB)"
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg", children: "El chat está cerrado. Este evento ha finalizado." })
  ] });
};
const syncEventToGoogleCalendar = (eventId, signal) => apiClient.post(`/api/integration/googlecalendar/sync/${eventId}`, {}, { signal }).then((res) => res.data);
const EventDetailPage = () => {
  const { eventId } = useParams();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const [ticket, setTicket] = reactExports.useState(null);
  const {
    data: event,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: ({ signal }) => fetchEventDetail(Number(eventId), signal),
    enabled: Boolean(eventId),
    refetchInterval: 5e3
  });
  const registerMutation = useMutation({
    mutationFn: () => registerForEvent(Number(eventId)),
    onSuccess: (response) => {
      setTicket(response.qrBase64);
      pushToast({ type: "success", title: "Registro exitoso", description: "Tu QR está listo para el check-in." });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "No se pudo registrar", description: error.message || "Error al registrarse" });
    }
  });
  const startMutation = useMutation({
    mutationFn: () => startEvent(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: "success", title: "Evento iniciado", description: "El chat ahora está activo." });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo iniciar el evento" });
    }
  });
  const finishMutation = useMutation({
    mutationFn: () => finishEvent(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: "success", title: "Evento finalizado", description: "El evento ha sido marcado como finalizado." });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo finalizar el evento" });
    }
  });
  const calendarMutation = useMutation({
    mutationFn: () => syncEventToGoogleCalendar(Number(eventId)),
    onSuccess: () => {
      pushToast({ type: "success", title: "Sincronizado", description: "Evento agregado a Google Calendar. Los usuarios registrados recibirán una invitación." });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo sincronizar con Google Calendar. Verifica que GOOGLE_CALENDAR_ACCESS_TOKEN esté configurado." });
    }
  });
  const canManageEvent = user && (user.role === "ADMIN" || user.role === "SERVER");
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando evento" });
  }
  if (isError || !event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Evento no encontrado", description: "Verifica el enlace e intenta nuevamente." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Eventos", to: "/events" }, { label: event.title }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold gradient-text", children: event.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: event.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed", children: event.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2 rounded-full bg-primary-100 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300", children: event.category }),
          event.faculty && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinIcon, { className: "h-4 w-4" }),
            event.faculty
          ] }),
          event.career && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm text-slate-700 dark:text-slate-300", children: event.career })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClockIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Inicio" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-900 dark:text-white", children: formatDateTime(event.startTime) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarIcon$1, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400", children: "Fin" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-slate-900 dark:text-white", children: formatDateTime(event.endTime) })
        ] }),
        canManageEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-warning-50 to-warning-100/30 dark:from-warning-900/20 dark:to-warning-800/10 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3", children: "Acciones" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            event.status === "PENDING" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => startMutation.mutate(),
                disabled: startMutation.isLoading,
                className: "btn-primary text-sm py-2 flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PlayIcon$1, { className: "h-4 w-4" }),
                  startMutation.isLoading ? "Iniciando..." : "Iniciar Evento"
                ]
              }
            ),
            event.status === "LIVE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => finishMutation.mutate(),
                disabled: finishMutation.isLoading,
                className: "btn-secondary text-sm py-2 flex items-center justify-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StopIcon$1, { className: "h-4 w-4" }),
                  finishMutation.isLoading ? "Finalizando..." : "Finalizar Evento"
                ]
              }
            )
          ] })
        ] })
      ] }),
      event.tags && event.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700", children: event.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-300",
          children: [
            "#",
            tag
          ]
        },
        tag
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      event.status !== "FINISHED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCodeIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Registro al Evento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 mb-6", children: "Genera tu código QR personal para hacer check-in de manera rápida y sencilla." }),
        !ticket ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => registerMutation.mutate(),
            disabled: registerMutation.isLoading,
            className: "btn-primary w-full",
            children: registerMutation.isLoading ? "Generando QR..." : "Generar Código QR"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: `data:image/png;base64,${ticket}`,
                alt: "QR de evento",
                className: "h-48 w-48 rounded-xl border-4 border-white dark:border-slate-700 shadow-lg"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-slate-500 dark:text-slate-400", children: "Muestra este código en el acceso al evento" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTicket(null),
              className: "btn-secondary w-full text-sm",
              children: "Generar Nuevo QR"
            }
          )
        ] })
      ] }),
      canManageEvent && event.status === "PENDING" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-gradient-to-br from-success-50/50 to-success-100/30 dark:from-success-900/20 dark:to-success-800/10 border-success-200 dark:border-success-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CloudArrowUpIcon$1, { className: "h-6 w-6 text-success-600 dark:text-success-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Google Calendar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 mb-4", children: "Sincroniza este evento con Google Calendar. Los usuarios registrados recibirán una invitación automáticamente." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => calendarMutation.mutate(),
            disabled: calendarMutation.isLoading,
            className: "btn-primary w-full",
            children: calendarMutation.isLoading ? "Sincronizando..." : "Sincronizar con Google Calendar"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChatBubbleLeftRightIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: event.status === "LIVE" ? "Chat en Vivo" : "Historial de Chat" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChatWindow, { eventId: Number(eventId), eventStatus: event.status, isLive: event.status === "LIVE" })
    ] })
  ] });
};
export {
  EventDetailPage as default
};
