import { r as reactExports, b as useSearchParams, u as useAuth, d as useDebouncedValue, j as jsxRuntimeExports, a as Link, M as MagnifyingGlassIcon, L as LoadingOverlay } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { u as useEvents, E as EventCard } from "./useEvents-248c8050.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { P as PaginationControls } from "./PaginationControls-e16a2223.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { P as PlusIcon } from "./PlusIcon-34f32654.js";
import "./StatusBadge-acb5659e.js";
import "./MapPinIcon-0b58321d.js";
import "./index-40c20874.js";
import "./eventService-3ce97835.js";
import "./usePaginatedQuery-9f703e2a.js";
import "./useQuery-9e6818c0.js";
import "./utils-814f13d4.js";
function FunnelIcon({
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
    d: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(FunnelIcon);
const FunnelIcon$1 = ForwardRef;
const EventListPage = () => {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 12);
  const status = params.get("status") ?? void 0;
  const category = params.get("category") ?? void 0;
  const searchParam = params.get("search") ?? "";
  const debouncedSearch = useDebouncedValue(searchParam, 500);
  const { events, pageMeta, isLoading } = useEvents({
    page,
    size,
    status,
    category,
    search: debouncedSearch || void 0
  });
  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === void 0 || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== "page") {
      next.set("page", "0");
    }
    setParams(next, { replace: true });
  };
  const categories = reactExports.useMemo(() => {
    const unique = new Set(events.flatMap((event) => event.category ? [event.category] : []));
    return Array.from(unique).sort();
  }, [events]);
  const canCreateEvents = user && (user.role === "ADMIN" || user.role === "SERVER");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Eventos" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold gradient-text", children: "Explorar Eventos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1", children: "Descubre y regístrate en eventos universitarios que te interesen" })
      ] }),
      canCreateEvents && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/events/new",
          className: "btn-primary inline-flex items-center gap-2 whitespace-nowrap",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
            "Crear Evento"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FunnelIcon$1, { className: "h-5 w-5 text-slate-600 dark:text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Filtros de Búsqueda" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MagnifyingGlassIcon, { className: "h-4 w-4 inline mr-1" }),
            "Buscar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              placeholder: "Título o descripción...",
              value: searchParam,
              onChange: (event) => updateParam("search", event.target.value || void 0)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectField,
          {
            label: "Estado",
            value: status ?? "",
            onChange: (event) => updateParam("status", event.target.value || void 0),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todos los estados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "PENDING", children: "Pendiente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "LIVE", children: "En vivo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "FINISHED", children: "Finalizado" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectField,
          {
            label: "Categoría",
            value: category ?? "",
            onChange: (event) => updateParam("category", event.target.value || void 0),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Todas las categorías" }),
              categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item, children: item }, item))
            ]
          }
        )
      ] }),
      (status || category || searchParam) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-slate-200 dark:border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            setParams({});
          },
          className: "text-sm text-primary-600 dark:text-primary-400 hover:underline",
          children: "Limpiar filtros"
        }
      ) })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando eventos" }) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "Sin resultados",
        description: searchParam || status || category ? "No se encontraron eventos con los filtros seleccionados. Prueba con otros criterios." : "Aún no hay eventos disponibles. Vuelve más tarde."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: [
        "Mostrando ",
        events.length,
        " de ",
        (pageMeta == null ? void 0 : pageMeta.totalElements) ?? 0,
        " eventos"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: events.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event }, event.id)) })
    ] }),
    pageMeta && pageMeta.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaginationControls,
      {
        page: pageMeta.page,
        size: pageMeta.size,
        totalPages: pageMeta.totalPages,
        totalElements: pageMeta.totalElements,
        onPageChange: (nextPage) => updateParam("page", nextPage),
        onSizeChange: (nextSize) => updateParam("size", nextSize)
      }
    ) })
  ] });
};
export {
  EventListPage as default
};
