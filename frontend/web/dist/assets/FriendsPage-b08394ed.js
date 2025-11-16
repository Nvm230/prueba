import { r as reactExports, u as useAuth, g as useToast, l as useNavigate, i as useQueryClient, j as jsxRuntimeExports, U as UserPlusIcon, Q as QrCodeIcon, M as MagnifyingGlassIcon, L as LoadingOverlay, A as Avatar, X as XMarkIcon } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { s as searchUsers, a as getFriends, b as getFriendRequests, c as getFriendRecommendations, d as sendFriendRequest, e as acceptFriendRequest, r as rejectFriendRequest, f as scanQr } from "./socialService-5a59fc5f.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import "./utils-814f13d4.js";
function CheckIcon({
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
    d: "m4.5 12.75 6 6 9-13.5"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(CheckIcon);
const CheckIcon$1 = ForwardRef;
const FriendsPage = () => {
  useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("friends");
  const [searchEmail, setSearchEmail] = reactExports.useState("");
  const [qrData, setQrData] = reactExports.useState("");
  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: ({ signal }) => getFriends(signal),
    enabled: activeTab === "friends"
  });
  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: ({ signal }) => getFriendRequests(signal),
    enabled: activeTab === "requests"
  });
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["friendRecommendations"],
    queryFn: ({ signal }) => getFriendRecommendations(signal),
    enabled: activeTab === "recommendations"
  });
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["userSearch", searchEmail],
    queryFn: ({ signal }) => searchUsers(searchEmail, signal),
    enabled: activeTab === "search" && searchEmail.length >= 3
  });
  const sendRequestMutation = useMutation({
    mutationFn: (receiverId) => sendFriendRequest(receiverId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Solicitud enviada", description: "La solicitud de amistad fue enviada." });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friendRecommendations"] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo enviar la solicitud" });
    }
  });
  const acceptMutation = useMutation({
    mutationFn: (requestId) => acceptFriendRequest(requestId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Solicitud aceptada", description: "Ahora son amigos." });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo aceptar la solicitud" });
    }
  });
  const rejectMutation = useMutation({
    mutationFn: (requestId) => rejectFriendRequest(requestId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Solicitud rechazada", description: "La solicitud fue rechazada." });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "No se pudo rechazar la solicitud" });
    }
  });
  const scanQrMutation = useMutation({
    mutationFn: (qrData2) => scanQr(qrData2),
    onSuccess: (data) => {
      sendRequestMutation.mutate(data.id);
      setQrData("");
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message || "QR inválido" });
    }
  });
  const handleScanQr = () => {
    if (!qrData.trim()) {
      pushToast({ type: "error", title: "Error", description: "Ingresa el código QR" });
      return;
    }
    scanQrMutation.mutate(qrData);
  };
  const tabs = [
    { id: "friends", name: "Amigos", count: (friends == null ? void 0 : friends.length) || 0 },
    { id: "requests", name: "Solicitudes", count: (requests == null ? void 0 : requests.length) || 0 },
    { id: "recommendations", name: "Recomendaciones", count: (recommendations == null ? void 0 : recommendations.length) || 0 },
    { id: "search", name: "Buscar" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Amigos" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlusIcon, { className: "h-8 w-8 text-primary-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Amigos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Gestiona tus conexiones y encuentra nuevos amigos" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-slate-200 dark:border-slate-700 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex gap-4", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`,
          children: [
            tab.name,
            tab.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs", children: tab.count })
          ]
        },
        tab.id
      )) }) }),
      activeTab === "search" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCodeIcon, { className: "h-5 w-5" }),
          "Agregar por código QR"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              placeholder: "Pega el código QR aquí",
              value: qrData,
              onChange: (e) => setQrData(e.target.value),
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SubmitButton,
            {
              onClick: handleScanQr,
              disabled: scanQrMutation.isLoading || !qrData.trim(),
              children: scanQrMutation.isLoading ? "Escaneando..." : "Escanear"
            }
          )
        ] })
      ] }),
      activeTab === "search" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: "Buscar por correo electrónico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "usuario@ejemplo.com",
              value: searchEmail,
              onChange: (e) => setSearchEmail(e.target.value),
              className: "input-field pr-10"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MagnifyingGlassIcon, { className: "absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        activeTab === "friends" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: friendsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando amigos" }) : !friends || friends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin amigos", description: "Agrega amigos para comenzar a chatear." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: friends.map((friend) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "card p-4 hover:shadow-md transition-shadow cursor-pointer",
            onClick: () => navigate(`/chat/${friend.id}`),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Avatar,
                {
                  user: {
                    name: friend.name,
                    profilePictureUrl: friend.profilePictureUrl
                  },
                  size: "md"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white truncate", children: friend.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: friend.email }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 dark:text-slate-500 mt-1", children: [
                  friend.points,
                  " puntos"
                ] })
              ] })
            ] })
          },
          friend.id
        )) }) }),
        activeTab === "requests" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: requestsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando solicitudes" }) : !requests || requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin solicitudes", description: "No tienes solicitudes pendientes." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: requests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              user: {
                name: request.sender.name,
                profilePictureUrl: request.sender.profilePictureUrl
              },
              size: "md"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white", children: request.sender.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: request.sender.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => acceptMutation.mutate(request.id),
                disabled: acceptMutation.isLoading,
                className: "p-2 rounded-lg bg-success-500 hover:bg-success-600 text-white transition-colors",
                title: "Aceptar",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckIcon$1, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  if (window.confirm("¿Estás seguro de que deseas rechazar esta solicitud de amistad?")) {
                    rejectMutation.mutate(request.id);
                  }
                },
                disabled: rejectMutation.isLoading,
                className: "p-2 rounded-lg bg-error-500 hover:bg-error-600 text-white transition-colors",
                title: "Rechazar",
                "aria-label": "Rechazar solicitud de amistad",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(XMarkIcon, { className: "h-5 w-5" })
              }
            )
          ] })
        ] }) }, request.id)) }) }),
        activeTab === "recommendations" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: recommendationsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando recomendaciones" }) : !recommendations || recommendations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Sin recomendaciones",
            description: "Asiste a eventos para ver recomendaciones de amigos."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: recommendations.map((recommended) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Avatar,
              {
                user: {
                  name: recommended.name,
                  profilePictureUrl: recommended.profilePictureUrl
                },
                size: "md"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white truncate", children: recommended.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 truncate", children: recommended.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-400 dark:text-slate-500 mt-1", children: [
                recommended.points,
                " puntos"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => sendRequestMutation.mutate(recommended.id),
              disabled: sendRequestMutation.isLoading,
              className: "btn-primary w-full text-sm",
              children: sendRequestMutation.isLoading ? "Enviando..." : "Enviar solicitud"
            }
          )
        ] }, recommended.id)) }) }),
        activeTab === "search" && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: searchLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Buscando usuarios" }) : !searchResults || searchResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Sin resultados",
            description: searchEmail.length < 3 ? "Escribe al menos 3 caracteres para buscar" : "No se encontraron usuarios"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: searchResults.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Avatar,
            {
              user: {
                name: result.name,
                profilePictureUrl: result.profilePictureUrl
              },
              size: "md"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-slate-900 dark:text-white", children: result.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: result.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => sendRequestMutation.mutate(result.id),
              disabled: sendRequestMutation.isLoading,
              className: "btn-primary text-sm",
              children: sendRequestMutation.isLoading ? "Enviando..." : "Agregar"
            }
          )
        ] }) }, result.id)) }) })
      ] })
    ] })
  ] });
};
export {
  FriendsPage as default
};
