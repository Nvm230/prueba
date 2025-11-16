import { b as useSearchParams, g as useToast, u as useAuth, j as jsxRuntimeExports, L as LoadingOverlay } from "./index-74821ec3.js";
import { u as usePaginatedQuery } from "./usePaginatedQuery-9f703e2a.js";
import { f as fetchUsers, u as updateUserRole } from "./userService-663d9ae7.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { P as PaginationControls } from "./PaginationControls-e16a2223.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import "./useQuery-9e6818c0.js";
import "./utils-814f13d4.js";
const AdminUsersPage = () => {
  var _a;
  const [params, setParams] = useSearchParams();
  const { pushToast } = useToast();
  const { user: currentUser } = useAuth();
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);
  const search = params.get("search") ?? void 0;
  const query = usePaginatedQuery({
    queryKey: ["users", { page, size, search }],
    queryFn: (signal) => fetchUsers({ page, size, search }, signal)
  });
  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    if (key !== "page") {
      next.set("page", "0");
    }
    setParams(next, { replace: true });
  };
  const handleRoleChange = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      pushToast({ type: "success", title: "Rol actualizado", description: "Los cambios se aplicaron correctamente." });
      query.refetch();
    } catch (error) {
      pushToast({ type: "error", title: "No se pudo actualizar", description: error.message });
    }
  };
  const users = ((_a = query.data) == null ? void 0 : _a.content) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Administración" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-4 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Gestión de usuarios" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Administra roles y accesos del equipo." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Buscar",
            placeholder: "Nombre o correo",
            value: search ?? "",
            onChange: (event) => updateParam("search", event.target.value || void 0)
          }
        ) })
      ] }),
      query.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando usuarios" }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin usuarios", description: "No se encontraron usuarios con los filtros aplicados." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-left text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs uppercase tracking-wide text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Nombre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Correo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Rol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Puntos" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: users.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70 dark:hover:bg-slate-800/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-900 dark:text-slate-100", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500 dark:text-slate-300", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SelectField,
              {
                label: "",
                value: user.role,
                onChange: (event) => handleRoleChange(user.id, event.target.value),
                disabled: (currentUser == null ? void 0 : currentUser.id) === user.id && (currentUser == null ? void 0 : currentUser.role) === "ADMIN" && user.role === "ADMIN",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "USER", children: "USER" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "SERVER", children: "SERVER" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ADMIN", children: "ADMIN" })
                ]
              }
            ),
            (currentUser == null ? void 0 : currentUser.id) === user.id && (currentUser == null ? void 0 : currentUser.role) === "ADMIN" && user.role === "ADMIN" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-1", children: "No puedes modificar tu propio rol" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-500 dark:text-slate-300", children: user.points })
        ] }, user.id)) })
      ] }) }),
      query.data && query.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaginationControls,
        {
          page: query.data.page,
          size: query.data.size,
          totalPages: query.data.totalPages,
          totalElements: query.data.totalElements,
          onPageChange: (nextPage) => updateParam("page", nextPage),
          onSizeChange: (nextSize) => updateParam("size", nextSize)
        }
      )
    ] })
  ] });
};
export {
  AdminUsersPage as default
};
