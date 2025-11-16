var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { r as reactExports, s as storage, t as tokenStorageKey, e as Client, S as SockJS, u as useAuth, g as useToast, j as jsxRuntimeExports, A as Avatar, X as XMarkIcon, h as useParams, l as useNavigate, i as useQueryClient, L as LoadingOverlay, C as CalendarDaysIcon, k as ChatBubbleLeftRightIcon, q as ClipboardDocumentListIcon } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { g as getGroupMessages, a as fetchGroupDetail, b as getGroupAnnouncements, d as getGroupEvents, e as getGroupSurveys, h as createGroupAnnouncement, i as createGroupEvent, s as shareSurveyToGroup, k as createGroupSurvey } from "./groupService-7d8a3f1e.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { f as format } from "./index-40c20874.js";
import { A as ArrowDownTrayIcon, D as DocumentIcon, P as PaperClipIcon, C as CameraIcon } from "./PaperClipIcon-328e4719.js";
import { P as PhotoIcon } from "./PhotoIcon-382c3ecc.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { b as fetchSurveys } from "./surveyService-252277d9.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { r as registerForEvent } from "./registrationService-2550b869.js";
import { f as formatDateTime } from "./formatters-dc58be6b.js";
import { S as StatusBadge } from "./StatusBadge-acb5659e.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import { P as PlusIcon } from "./PlusIcon-34f32654.js";
import "./utils-814f13d4.js";
function ArrowRightIcon({
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
    d: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(ArrowRightIcon);
const ArrowRightIcon$1 = ForwardRef$1;
function MegaphoneIcon({
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
    d: "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(MegaphoneIcon);
const MegaphoneIcon$1 = ForwardRef;
const getWsBaseUrl = () => {
  const envUrl = {}.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const WS_BASE_URL = getWsBaseUrl();
class GroupChannelService {
  constructor() {
    __publicField(this, "clients", /* @__PURE__ */ new Map());
  }
  connect(groupId, onMessage, onError) {
    if (this.clients.has(groupId)) {
      return () => this.disconnect(groupId);
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
        console.log(`[Group Channel] Connected for group ${groupId}`);
        client.subscribe(`/topic/groups.${groupId}`, (message) => {
          try {
            const groupMessage = JSON.parse(message.body);
            onMessage(groupMessage);
          } catch (error) {
            console.error("[Group Channel] Error parsing message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error("[Group Channel] STOMP error:", frame);
        onError == null ? void 0 : onError(frame);
      },
      onWebSocketError: (event) => {
        console.error("[Group Channel] WebSocket error:", event);
        onError == null ? void 0 : onError(event);
      }
    });
    client.activate();
    this.clients.set(groupId, client);
    return () => this.disconnect(groupId);
  }
  sendMessage(groupId, message) {
    const client = this.clients.get(groupId);
    if (client && client.connected) {
      client.publish({
        destination: `/app/group.${groupId}.send`,
        body: JSON.stringify(message)
      });
    } else {
      console.warn(`[Group Channel] Cannot send message: client not connected`);
    }
  }
  disconnect(groupId) {
    const client = this.clients.get(groupId);
    if (client) {
      client.deactivate();
      this.clients.delete(groupId);
      console.log(`[Group Channel] Disconnected for group ${groupId}`);
    }
  }
  disconnectAll() {
    this.clients.forEach((client, groupId) => {
      client.deactivate();
    });
    this.clients.clear();
  }
}
const groupChannelService = new GroupChannelService();
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
const GroupChannelWindow = ({ groupId, canSend }) => {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [messageInput, setMessageInput] = reactExports.useState("");
  const [isConnected, setIsConnected] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([]);
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const cameraInputRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const { data: savedMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["groupMessages", groupId],
    queryFn: ({ signal }) => getGroupMessages(groupId, { page: 0, size: 100 }, signal),
    enabled: Boolean(groupId && user)
  });
  reactExports.useEffect(() => {
    if (savedMessages == null ? void 0 : savedMessages.content) {
      setMessages(savedMessages.content);
    }
  }, [savedMessages]);
  reactExports.useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }
    const disconnect = groupChannelService.connect(
      groupId,
      (message) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      },
      (error) => {
        console.error("Group channel error:", error);
        setIsConnected(false);
      }
    );
    setIsConnected(true);
    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [user, groupId]);
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
    if (!messageInput.trim() && !selectedFile || !user || !canSend)
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
        groupChannelService.sendMessage(groupId, {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 overflow-y-auto flex flex-col gap-3", children: [
      messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-slate-400 dark:text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "No hay mensajes aún. ",
        canSend ? "Sé el primero en escribir!" : "El administrador aún no ha enviado mensajes."
      ] }) }) : messages.map((msg) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              user: {
                name: msg.sender.name,
                profilePictureUrl: msg.sender.profilePictureUrl
              },
              size: "sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 max-w-[70%]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: msg.sender.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 dark:text-slate-500", children: format(new Date(msg.createdAt), "HH:mm") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white", children: [
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
              msg.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words", children: msg.content })
            ] })
          ] })
        ] }, msg.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
    ] }),
    canSend ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
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
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-slate-500 dark:text-slate-400 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg", children: "Solo el administrador del grupo puede enviar mensajes." })
  ] });
};
const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("messages");
  const [showCreateEvent, setShowCreateEvent] = reactExports.useState(false);
  const [showAnnouncement, setShowAnnouncement] = reactExports.useState(false);
  const [showShareSurvey, setShowShareSurvey] = reactExports.useState(false);
  const [showCreateSurvey, setShowCreateSurvey] = reactExports.useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = reactExports.useState(null);
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: ({ signal }) => fetchGroupDetail(Number(groupId), signal),
    enabled: Boolean(groupId)
  });
  const isMember = user && group && group.members.some((m) => m.id === user.id);
  const canManage = user && group && (group.owner.id === user.id || user.role === "SERVER" || user.role === "ADMIN");
  const { data: announcements } = useQuery({
    queryKey: ["groupAnnouncements", groupId],
    queryFn: ({ signal }) => getGroupAnnouncements(Number(groupId), { page: 0, size: 20 }, signal),
    enabled: Boolean(groupId) && activeTab === "announcements"
  });
  const { data: groupEvents } = useQuery({
    queryKey: ["groupEvents", groupId],
    queryFn: ({ signal }) => getGroupEvents(Number(groupId), signal),
    enabled: Boolean(groupId) && activeTab === "events"
  });
  const { data: groupSurveys } = useQuery({
    queryKey: ["groupSurveys", groupId],
    queryFn: ({ signal }) => getGroupSurveys(Number(groupId), signal),
    enabled: Boolean(groupId) && activeTab === "surveys"
  });
  const { data: availableSurveys } = useQuery({
    queryKey: ["surveys", "all"],
    queryFn: ({ signal }) => fetchSurveys({}, signal),
    enabled: Boolean(canManage && activeTab === "surveys")
  });
  const announcementForm = useForm();
  const eventForm = useForm();
  const surveyForm = useForm();
  const createAnnouncementMutation = useMutation({
    mutationFn: (data) => createGroupAnnouncement(Number(groupId), data),
    onSuccess: () => {
      pushToast({ type: "success", title: "Anuncio creado", description: "El anuncio fue publicado en el grupo." });
      setShowAnnouncement(false);
      announcementForm.reset();
      queryClient.invalidateQueries({ queryKey: ["groupAnnouncements", groupId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo crear el anuncio" });
    }
  });
  const createEventMutation = useMutation({
    mutationFn: (data) => createGroupEvent(Number(groupId), data),
    onSuccess: () => {
      pushToast({ type: "success", title: "Evento creado", description: "El evento fue creado y compartido en el grupo." });
      setShowCreateEvent(false);
      eventForm.reset();
      queryClient.invalidateQueries({ queryKey: ["groupEvents", groupId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo crear el evento" });
    }
  });
  const registerMutation = useMutation({
    mutationFn: (eventId) => registerForEvent(eventId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Registrado", description: "Te has registrado al evento exitosamente." });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo registrar al evento" });
    }
  });
  const shareSurveyMutation = useMutation({
    mutationFn: (surveyId) => shareSurveyToGroup(Number(groupId), surveyId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Encuesta compartida", description: "La encuesta fue compartida en el grupo." });
      setShowShareSurvey(false);
      setSelectedSurveyId(null);
      queryClient.invalidateQueries({ queryKey: ["groupSurveys", groupId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo compartir la encuesta" });
    }
  });
  const createSurveyMutation = useMutation({
    mutationFn: (data) => createGroupSurvey(Number(groupId), data),
    onSuccess: () => {
      pushToast({ type: "success", title: "Encuesta creada", description: "La encuesta fue creada y compartida en el grupo." });
      setShowCreateSurvey(false);
      surveyForm.reset();
      queryClient.invalidateQueries({ queryKey: ["groupSurveys", groupId] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo crear la encuesta" });
    }
  });
  if (groupLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando grupo" });
  }
  if (!group) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Grupo no encontrado", description: "El grupo que buscas no existe." });
  }
  if (!isMember) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Grupos", to: "/groups" }, { label: group.name }] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-slate-900 dark:text-white mb-2", children: "No eres miembro de este grupo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 dark:text-slate-400 mb-4", children: "Únete al grupo para ver su contenido." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate("/groups"), className: "btn-primary", children: "Volver a grupos" })
      ] })
    ] });
  }
  const tabs = [
    { id: "messages", name: "Mensajes", icon: ChatBubbleLeftRightIcon },
    { id: "announcements", name: "Anuncios", icon: MegaphoneIcon$1 },
    { id: "events", name: "Eventos", icon: CalendarDaysIcon },
    { id: "surveys", name: "Encuestas", icon: ClipboardDocumentListIcon }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Grupos", to: "/groups" }, { label: group.name }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold gradient-text", children: group.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1", children: [
          "Administrado por ",
          group.owner.name,
          " • ",
          group.members.length,
          " miembros"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        group.members.slice(0, 5).map((member) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Avatar,
          {
            user: {
              name: member.name,
              profilePictureUrl: member.profilePictureUrl
            },
            size: "sm"
          },
          member.id
        )),
        group.members.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-slate-500 dark:text-slate-400", children: [
          "+",
          group.members.length - 5
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-slate-200 dark:border-slate-700 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex gap-4", children: tabs.map((tab) => {
        const Icon = tab.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab(tab.id),
            className: `pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }),
              tab.name
            ]
          },
          tab.id
        );
      }) }) }),
      activeTab === "messages" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white mb-2", children: "Canal de Mensajes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: canManage ? "Envía mensajes e información a todos los miembros del grupo." : "Solo el administrador puede enviar mensajes en este canal." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GroupChannelWindow, { groupId: Number(groupId), canSend: !!canManage })
      ] }),
      activeTab === "announcements" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        canManage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowAnnouncement(!showAnnouncement),
            className: "btn-primary inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
              "Crear Anuncio"
            ]
          }
        ) }),
        showAnnouncement && canManage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: announcementForm.handleSubmit((data) => createAnnouncementMutation.mutate(data)),
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TextField,
                {
                  label: "Título",
                  ...announcementForm.register("title", { required: true }),
                  required: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: "Contenido" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    rows: 4,
                    className: "mt-1 w-full input-field",
                    ...announcementForm.register("content", { required: true })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { disabled: createAnnouncementMutation.isLoading, children: "Publicar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowAnnouncement(false);
                      announcementForm.reset();
                    },
                    className: "btn-secondary",
                    children: "Cancelar"
                  }
                )
              ] })
            ]
          }
        ) }),
        !announcements || announcements.content.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin anuncios", description: "Aún no hay anuncios en este grupo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: announcements.content.map((ann) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MegaphoneIcon$1, { className: "h-6 w-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-1", children: ann.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap", children: ann.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-2", children: [
              "Por ",
              ann.sender.name,
              " • ",
              formatDateTime(ann.createdAt)
            ] })
          ] })
        ] }) }, ann.id)) })
      ] }),
      activeTab === "events" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        canManage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowCreateEvent(!showCreateEvent),
            className: "btn-primary inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
              "Crear Evento"
            ]
          }
        ) }),
        showCreateEvent && canManage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: eventForm.handleSubmit((data) => {
              const payload = {
                ...data,
                startTime: new Date(data.startTime).toISOString(),
                endTime: new Date(data.endTime).toISOString(),
                faculty: data.faculty || void 0,
                career: data.career || void 0
              };
              createEventMutation.mutate(payload);
            }),
            className: "space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TextField, { label: "Título", ...eventForm.register("title", { required: true }), required: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TextField, { label: "Categoría", ...eventForm.register("category", { required: true }), required: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TextField, { label: "Facultad", ...eventForm.register("faculty") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TextField, { label: "Carrera", ...eventForm.register("career") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TextField,
                  {
                    label: "Fecha y hora de inicio",
                    type: "datetime-local",
                    ...eventForm.register("startTime", { required: true }),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TextField,
                  {
                    label: "Fecha y hora de fin",
                    type: "datetime-local",
                    ...eventForm.register("endTime", { required: true }),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: "Descripción" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: "mt-1 w-full input-field", ...eventForm.register("description", { required: true }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { disabled: createEventMutation.isLoading, children: "Crear y Compartir" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowCreateEvent(false);
                      eventForm.reset();
                    },
                    className: "btn-secondary",
                    children: "Cancelar"
                  }
                )
              ] })
            ]
          }
        ) }),
        !groupEvents || groupEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin eventos", description: "Aún no hay eventos compartidos en este grupo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: groupEvents.map((ge) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card hover:shadow-md transition-shadow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-1", children: ge.event.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: ge.event.status })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2", children: ge.event.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDaysIcon, { className: "h-4 w-4 inline mr-1" }),
              formatDateTime(ge.event.startTime)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
              "Compartido por ",
              ge.sharedBy.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => navigate(`/events/${ge.event.id}`),
                className: "btn-secondary flex-1 text-sm",
                children: "Ver Detalles"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => registerMutation.mutate(ge.event.id),
                disabled: registerMutation.isLoading,
                className: "btn-primary flex-1 text-sm inline-flex items-center justify-center gap-1",
                children: [
                  "Registrarse",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightIcon$1, { className: "h-4 w-4" })
                ]
              }
            )
          ] })
        ] }, ge.id)) })
      ] }),
      activeTab === "surveys" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowCreateSurvey(!showCreateSurvey),
              className: "btn-primary inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
                "Crear Encuesta"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setShowShareSurvey(!showShareSurvey),
              className: "btn-secondary inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
                "Compartir Encuesta Existente"
              ]
            }
          )
        ] }),
        showCreateSurvey && canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card border-primary-200 dark:border-primary-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white mb-4", children: "Crear Encuesta para el Grupo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: surveyForm.handleSubmit((data) => {
                const questions = data.questions.split("\n").map((q) => q.trim()).filter(Boolean);
                createSurveyMutation.mutate({ title: data.title, questions });
              }),
              className: "space-y-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TextField,
                  {
                    label: "Título de la Encuesta",
                    ...surveyForm.register("title", { required: true }),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: "Preguntas" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-1", children: "Escribe cada pregunta en una línea separada" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      rows: 4,
                      className: "mt-1 w-full input-field",
                      placeholder: "¿Qué te parece el grupo?\\n¿Qué actividades te gustaría hacer?\\n¿Tienes alguna sugerencia?",
                      ...surveyForm.register("questions", { required: true })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { disabled: createSurveyMutation.isLoading, children: "Crear y Compartir" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setShowCreateSurvey(false);
                        surveyForm.reset();
                      },
                      className: "btn-secondary",
                      children: "Cancelar"
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        showShareSurvey && canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card border-primary-200 dark:border-primary-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white mb-4", children: "Compartir Encuesta en el Grupo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SelectField,
              {
                label: "Seleccionar Encuesta",
                value: (selectedSurveyId == null ? void 0 : selectedSurveyId.toString()) || "",
                onChange: (e) => setSelectedSurveyId(e.target.value ? Number(e.target.value) : null),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona una encuesta" }),
                  availableSurveys == null ? void 0 : availableSurveys.map((survey) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: survey.id, children: [
                    survey.title,
                    " ",
                    survey.event ? `- Evento: ${survey.event.title}` : "(Encuesta de grupo)"
                  ] }, survey.id))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (selectedSurveyId) {
                      shareSurveyMutation.mutate(selectedSurveyId);
                    }
                  },
                  disabled: shareSurveyMutation.isLoading || !selectedSurveyId,
                  className: "btn-primary",
                  children: "Compartir"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setShowShareSurvey(false);
                    setSelectedSurveyId(null);
                  },
                  className: "btn-secondary",
                  children: "Cancelar"
                }
              )
            ] })
          ] })
        ] }),
        !groupSurveys || groupSurveys.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin encuestas", description: "Aún no hay encuestas compartidas en este grupo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: groupSurveys.map((gs) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white mb-1", children: gs.survey.title }),
            gs.survey.event && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: [
              "Evento: ",
              gs.survey.event.title
            ] }),
            !gs.survey.event && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Encuesta del grupo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: [
              gs.survey.event ? "Compartida" : "Creada",
              " por ",
              gs.sharedBy.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => navigate(`/surveys`),
              className: "btn-primary text-sm",
              children: "Responder"
            }
          )
        ] }) }, gs.id)) })
      ] })
    ] })
  ] });
};
export {
  GroupDetailPage as default
};
