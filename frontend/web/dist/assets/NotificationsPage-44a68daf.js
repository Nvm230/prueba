var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { r as reactExports, s as storage, t as tokenStorageKey, e as Client, S as SockJS, b as useSearchParams, u as useAuth, g as useToast, i as useQueryClient, j as jsxRuntimeExports, B as BellAlertIcon, L as LoadingOverlay } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { P as PaginationControls } from "./PaginationControls-e16a2223.js";
import { u as usePaginatedQuery } from "./usePaginatedQuery-9f703e2a.js";
import { f as fetchNotifications, s as sendNotification } from "./notificationService-c1b9e504.js";
import { f as fetchUsers } from "./userService-663d9ae7.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { t as timeAgo } from "./formatters-dc58be6b.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import "./index-40c20874.js";
import "./utils-814f13d4.js";
function InformationCircleIcon({
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
    d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(InformationCircleIcon);
const InformationCircleIcon$1 = ForwardRef$1;
function PaperAirplaneIcon({
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
    d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(PaperAirplaneIcon);
const PaperAirplaneIcon$1 = ForwardRef;
const getWsBaseUrl = () => {
  const envUrl = {}.VITE_WS_BASE_URL;
  if (envUrl && envUrl !== "") {
    return envUrl;
  }
  return "http://localhost:8080";
};
const WS_BASE_URL = getWsBaseUrl();
class NotificationWebSocketService {
  constructor() {
    __publicField(this, "client", null);
    __publicField(this, "subscribers", /* @__PURE__ */ new Map());
  }
  connect(userId, onNotification) {
    try {
      if (this.subscribers.has(userId)) {
        const existingCallback = this.subscribers.get(userId);
        this.subscribers.set(userId, (notif) => {
          existingCallback == null ? void 0 : existingCallback(notif);
          onNotification(notif);
        });
        return () => this.unsubscribe(userId, onNotification);
      }
      if (!this.client) {
        const token = storage.get(tokenStorageKey);
        this.client = new Client({
          webSocketFactory: () => {
            try {
              return new SockJS(`${WS_BASE_URL}/ws`);
            } catch (error) {
              console.error("[Notification WS] Error creating SockJS:", error);
              throw error;
            }
          },
          connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
          debug: (str) => {
            if (false)
              ;
          },
          reconnectDelay: 5e3,
          heartbeatIncoming: 4e3,
          heartbeatOutgoing: 4e3,
          onConnect: () => {
            console.log("[Notification WS] Connected");
            this.subscribers.forEach((_, userId2) => {
              try {
                this.subscribeToUser(userId2);
              } catch (error) {
                console.error(`[Notification WS] Error subscribing to user ${userId2}:`, error);
              }
            });
          },
          onStompError: (frame) => {
            console.error("[Notification WS] STOMP error:", frame);
          },
          onWebSocketError: (event) => {
            console.error("[Notification WS] WebSocket error:", event);
          }
        });
        try {
          this.client.activate();
        } catch (error) {
          console.error("[Notification WS] Error activating client:", error);
          this.client = null;
          throw error;
        }
      }
      this.subscribers.set(userId, onNotification);
      if (this.client && this.client.connected) {
        try {
          this.subscribeToUser(userId);
        } catch (error) {
          console.error(`[Notification WS] Error subscribing to user ${userId}:`, error);
        }
      }
      return () => this.unsubscribe(userId, onNotification);
    } catch (error) {
      console.error("[Notification WS] Error in connect:", error);
      return () => {
      };
    }
  }
  subscribeToUser(userId) {
    if (!this.client || !this.client.connected)
      return;
    const destination = `/queue/notifications.${userId}`;
    this.client.subscribe(destination, (message) => {
      try {
        const notification = JSON.parse(message.body);
        const callback = this.subscribers.get(userId);
        if (callback) {
          callback(notification);
        }
      } catch (error) {
        console.error("[Notification WS] Error parsing notification:", error);
      }
    });
    console.log(`[Notification WS] Subscribed to ${destination}`);
  }
  unsubscribe(userId, callback) {
    const existing = this.subscribers.get(userId);
    if (existing === callback) {
      this.subscribers.delete(userId);
    } else if (existing) {
      this.subscribers.set(userId, (notif) => {
        if (existing !== callback) {
          existing(notif);
        }
      });
    }
    if (this.subscribers.size === 0 && this.client) {
      this.client.deactivate();
      this.client = null;
      console.log("[Notification WS] Disconnected (no subscribers)");
    }
  }
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.subscribers.clear();
      console.log("[Notification WS] Disconnected");
    }
  }
}
const notificationWebSocketService = new NotificationWebSocketService();
const NotificationsPage = () => {
  var _a, _b, _c, _d, _e;
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [selectedUserId, setSelectedUserId] = reactExports.useState(null);
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);
  const query = usePaginatedQuery({
    queryKey: ["notifications", user == null ? void 0 : user.id, { page, size }],
    queryFn: (signal) => fetchNotifications(user.id, { page, size }, signal),
    enabled: Boolean(user)
  });
  const { data: usersData } = useQuery({
    queryKey: ["users", { page: 0, size: 100 }],
    queryFn: ({ signal }) => fetchUsers({ page: 0, size: 100 }, signal),
    enabled: Boolean(user && (user.role === "ADMIN" || user.role === "SERVER"))
  });
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    if (!(user == null ? void 0 : user.id))
      return;
    let disconnect = null;
    try {
      disconnect = notificationWebSocketService.connect(user.id, (notification) => {
        pushToast({
          type: "info",
          title: notification.title,
          description: notification.message
        });
        queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      });
    } catch (error) {
      console.error("[Notifications] Error connecting to WebSocket:", error);
    }
    return () => {
      if (disconnect) {
        try {
          disconnect();
        } catch (error) {
          console.error("[Notifications] Error disconnecting WebSocket:", error);
        }
      }
    };
  }, [user == null ? void 0 : user.id, pushToast, queryClient]);
  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    next.set(key, String(value));
    setParams(next, { replace: true });
  };
  const { register, handleSubmit, reset, formState, watch } = useForm({
    defaultValues: {
      title: "",
      message: "",
      sendEmail: false
    }
  });
  const sendEmailEnabled = watch("sendEmail");
  const canSendNotifications = user && (user.role === "ADMIN" || user.role === "SERVER");
  const targetUserId = selectedUserId || (user == null ? void 0 : user.id);
  const onSubmit = async (values) => {
    var _a2, _b2;
    if (!targetUserId)
      return;
    try {
      await sendNotification(targetUserId, {
        title: values.title,
        message: values.message,
        sendEmail: values.sendEmail
      });
      pushToast({
        type: "success",
        title: "Notificación enviada",
        description: canSendNotifications && selectedUserId ? `La notificación fue enviada al usuario seleccionado.${values.sendEmail ? " También se envió por correo electrónico." : ""}` : `Se envió a tu bandeja personal.${values.sendEmail ? " También se envió por correo electrónico." : ""}`
      });
      reset();
      query.refetch();
    } catch (error) {
      pushToast({
        type: "error",
        title: "Error al enviar",
        description: ((_b2 = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || error.message || "No se pudo enviar la notificación"
      });
    }
  };
  const notifications = ((_a = query.data) == null ? void 0 : _a.content) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Notificaciones" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-gradient-to-br from-primary-50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(InformationCircleIcon$1, { className: "h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-900 dark:text-white mb-1", children: "¿Cómo funcionan las notificaciones?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 leading-relaxed", children: canSendNotifications ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Como ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: user == null ? void 0 : user.role }),
          ", puedes enviar notificaciones a cualquier usuario del sistema. Las notificaciones se envían en tiempo real y aparecen inmediatamente en la bandeja del destinatario. También recibes notificaciones automáticas cuando te registras a eventos."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Recibirás notificaciones automáticas cuando te registres a eventos. Los administradores también pueden enviarte notificaciones importantes sobre eventos o actualizaciones del sistema." }) })
      ] })
    ] }) }),
    canSendNotifications && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/70", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaperAirplaneIcon$1, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: "Enviar Notificación" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", noValidate: true, children: [
        usersData && usersData.content.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectField,
          {
            label: "Enviar a",
            value: (selectedUserId == null ? void 0 : selectedUserId.toString()) || ((_b = user == null ? void 0 : user.id) == null ? void 0 : _b.toString()) || "",
            onChange: (e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: (_c = user == null ? void 0 : user.id) == null ? void 0 : _c.toString(), children: "Mí mismo (prueba)" }),
              usersData.content.filter((u) => u.id !== (user == null ? void 0 : user.id)).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: u.id.toString(), children: [
                u.name,
                " (",
                u.email,
                ") - ",
                u.role
              ] }, u.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Título",
              placeholder: "Ej: Recordatorio de evento",
              error: (_d = formState.errors.title) == null ? void 0 : _d.message,
              ...register("title", { required: "El título es requerido" }),
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Mensaje",
              placeholder: "Ej: Tu evento comienza en 1 hora",
              error: (_e = formState.errors.message) == null ? void 0 : _e.message,
              ...register("message", { required: "El mensaje es requerido" }),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "sendEmail",
              ...register("sendEmail"),
              className: "h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sendEmail", className: "text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer", children: "Enviar también por correo electrónico" }),
          sendEmailEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-amber-600 dark:text-amber-400 font-medium", children: "⚠️ Se enviará un correo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SubmitButton, { className: "w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PaperAirplaneIcon$1, { className: "h-4 w-4 inline mr-2" }),
          "Enviar Notificación"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellAlertIcon, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Tus Notificaciones" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: notifications.length > 0 ? `${notifications.length} notificación${notifications.length !== 1 ? "es" : ""}` : "No tienes notificaciones aún" })
        ] })
      ] }),
      query.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando notificaciones" }) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          title: "Sin notificaciones",
          description: canSendNotifications ? "Envía una notificación de prueba o espera a que los usuarios se registren a eventos." : "Cuando recibas mensajes aparecerán en este listado."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: notifications.map((notification) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "li",
        {
          className: `rounded-xl border p-4 transition-all hover:shadow-md ${notification.readFlag ? "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50" : "border-primary-200 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-900/20"}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: notification.title }),
              !notification.readFlag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mb-2", children: notification.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 dark:text-slate-500", children: timeAgo(notification.createdAt) })
          ] }) })
        },
        notification.id
      )) }),
      query.data && query.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 pt-6 border-t border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaginationControls,
        {
          page: query.data.page,
          size: query.data.size,
          totalPages: query.data.totalPages,
          totalElements: query.data.totalElements,
          onPageChange: (nextPage) => updateParam("page", nextPage),
          onSizeChange: (nextSize) => updateParam("size", nextSize)
        }
      ) })
    ] })
  ] });
};
export {
  NotificationsPage as default
};
