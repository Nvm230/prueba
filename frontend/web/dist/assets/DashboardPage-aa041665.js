import { j as jsxRuntimeExports, c as classNames, u as useAuth, L as LoadingOverlay, C as CalendarDaysIcon, a as Link, B as BellAlertIcon } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { u as useEvents, E as EventCard } from "./useEvents-248c8050.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { f as fetchNotifications } from "./notificationService-c1b9e504.js";
import { t as timeAgo } from "./formatters-dc58be6b.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { S as SparklesIcon } from "./SparklesIcon-5e13cb87.js";
import { T as TrophyIcon } from "./TrophyIcon-68cfba8d.js";
import "./StatusBadge-acb5659e.js";
import "./MapPinIcon-0b58321d.js";
import "./index-40c20874.js";
import "./eventService-3ce97835.js";
import "./usePaginatedQuery-9f703e2a.js";
import "./utils-814f13d4.js";
const accentStyles = {
  primary: {
    bg: "from-primary-500/20 to-primary-500/0",
    text: "text-primary-600 dark:text-primary-200"
  },
  success: {
    bg: "from-emerald-500/20 to-emerald-500/0",
    text: "text-emerald-600 dark:text-emerald-200"
  },
  warning: {
    bg: "from-amber-500/20 to-amber-500/0",
    text: "text-amber-600 dark:text-amber-200"
  }
};
const StatCard = ({ title, value, trend, accent = "primary", icon }) => {
  const accentStyle = accentStyles[accent];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card group hover:scale-[1.02] transition-transform", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-600 dark:text-slate-400", children: title }),
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classNames("p-2 rounded-lg bg-gradient-to-br", accentStyle.bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classNames("text-lg", accentStyle.text), children: icon }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-slate-900 dark:text-white mb-2", children: value }),
    trend && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: classNames(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-r",
          accentStyle.bg,
          accentStyle.text
        ),
        children: trend
      }
    )
  ] });
};
const DashboardPage = () => {
  var _a;
  const { user } = useAuth();
  const { events, isLoading: loadingEvents } = useEvents({ page: 0, size: 4, status: "PENDING" });
  const { data: notifications, isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications", user == null ? void 0 : user.id, { page: 0, size: 5 }],
    queryFn: ({ signal }) => fetchNotifications(user.id, { page: 0, size: 5 }, signal),
    enabled: Boolean(user)
  });
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando perfil" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-gradient-to-br from-primary-50 via-primary-100/50 to-purple-50 dark:from-primary-900/20 dark:via-primary-800/10 dark:to-purple-900/20 border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-bold text-slate-900 dark:text-white mb-2", children: [
          "¡Hola, ",
          user.name,
          "! 👋"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-slate-600 dark:text-slate-300 max-w-2xl", children: "Bienvenido a UniVibe. Aquí tienes un resumen de tu participación en eventos y las últimas novedades." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SparklesIcon, { className: "h-12 w-12 text-primary-600 dark:text-primary-400" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Puntos Gamificados",
          value: user.points || 0,
          trend: "Sigue participando para ganar más",
          accent: "primary",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrophyIcon, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Rol",
          value: user.role,
          accent: "success"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Categorías Preferidas",
          value: ((_a = user.preferredCategories) == null ? void 0 : _a.length) || 0,
          accent: "warning"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          title: "Miembro desde",
          value: timeAgo(user.createdAt),
          trend: "Desde que te uniste",
          accent: "primary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDaysIcon, { className: "h-5 w-5 text-primary-600 dark:text-primary-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Próximos Eventos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Mantente al día con lo que viene" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/events",
              className: "text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline",
              children: "Ver todos"
            }
          )
        ] }),
        loadingEvents ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando eventos" }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Sin eventos próximos",
            description: "Regístrate en nuevos eventos desde la pestaña de eventos."
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: events.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event }, event.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellAlertIcon, { className: "h-5 w-5 text-warning-600 dark:text-warning-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white", children: "Notificaciones Recientes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Actualizaciones personalizadas para ti" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/notifications",
              className: "text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline",
              children: "Ver todas"
            }
          )
        ] }),
        loadingNotifications ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando notificaciones" }) : notifications && notifications.content.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: notifications.content.map((notification) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "rounded-xl border border-slate-200 dark:border-slate-700 glass p-4 hover:shadow-md transition-shadow",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-900 dark:text-white mb-1", children: notification.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400 line-clamp-2", children: notification.message })
                ] }),
                !notification.readFlag && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 dark:text-slate-500 mt-2 block", children: timeAgo(notification.createdAt) })
            ]
          },
          notification.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Sin notificaciones",
            description: "Cuando recibas nuevas alertas aparecerán aquí."
          }
        )
      ] })
    ] })
  ] });
};
export {
  DashboardPage as default
};
