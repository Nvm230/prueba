import { u as useAuth, j as jsxRuntimeExports, a as Link, r as reactExports } from "./index-74821ec3.js";
import { S as StatusBadge } from "./StatusBadge-acb5659e.js";
import { M as MapPinIcon, C as ClockIcon } from "./MapPinIcon-0b58321d.js";
import { f as format } from "./index-40c20874.js";
import { f as fetchEvents } from "./eventService-3ce97835.js";
import { u as usePaginatedQuery } from "./usePaginatedQuery-9f703e2a.js";
const EventCard = ({ event }) => {
  const { user } = useAuth();
  const isAdminOrServer = user && (user.role === "ADMIN" || user.role === "SERVER");
  const formatDate = (value) => {
    const date = typeof value === "string" ? new Date(value) : value;
    return format(date, "MMM d, yyyy, h:mm a");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: `/events/${event.id}`,
      className: "block rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 p-4 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200 group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1", children: event.title }),
              isAdminOrServer && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300", children: [
                "ID: ",
                event.id
              ] })
            ] }),
            event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3", children: event.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: event.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/30 px-2.5 py-1 text-xs font-medium text-primary-700 dark:text-primary-300", children: event.category }),
          event.faculty && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPinIcon, { className: "h-3 w-3" }),
            event.faculty
          ] }),
          event.tags && event.tags.length > 0 && event.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400",
              children: tag
            },
            tag
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClockIcon, { className: "h-3.5 w-3.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: formatDate(event.startTime) }),
          event.career && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 dark:text-slate-600", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: event.career })
          ] })
        ] })
      ]
    }
  );
};
const useEvents = (filters) => {
  const query = usePaginatedQuery({
    queryKey: ["events", filters],
    queryFn: (signal) => fetchEvents(filters, signal)
  });
  return reactExports.useMemo(() => {
    var _a;
    return {
      ...query,
      events: ((_a = query.data) == null ? void 0 : _a.content) ?? [],
      pageMeta: query.data
    };
  }, [query]);
};
export {
  EventCard as E,
  useEvents as u
};
