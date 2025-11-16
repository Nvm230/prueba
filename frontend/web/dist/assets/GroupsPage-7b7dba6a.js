import { l as useNavigate, u as useAuth, j as jsxRuntimeExports, b as useSearchParams, g as useToast, r as reactExports, d as useDebouncedValue, L as LoadingOverlay } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { o as objectType, s as stringType, t } from "./types-b8c6b9bb.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { P as PaginationControls } from "./PaginationControls-e16a2223.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { u as usePaginatedQuery } from "./usePaginatedQuery-9f703e2a.js";
import { f as fetchGroups, j as joinGroup, c as createGroup } from "./groupService-7d8a3f1e.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import { P as PlusIcon } from "./PlusIcon-34f32654.js";
import "./useQuery-9e6818c0.js";
import "./utils-814f13d4.js";
const GroupCard = ({ group, onJoin }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMember = user && group.members.some((m) => m.id === user.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer", onClick: () => navigate(`/groups/${group.id}`), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: group.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
          "Owner: ",
          group.owner.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1", children: [
        group.members.length,
        " members"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300", children: [
      group.members.slice(0, 4).map((member) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary-50 dark:bg-primary-600/10 px-2 py-1", children: member.name }, member.id)),
      group.members.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "+",
        group.members.length - 4,
        " more"
      ] })
    ] }),
    !isMember && onJoin && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: (e) => {
          e.stopPropagation();
          onJoin(group.id);
        },
        className: "self-start rounded-full bg-primary-600 hover:bg-primary-500 text-white px-4 py-1 text-sm transition",
        children: "Unirse al grupo"
      }
    ),
    isMember && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "self-start text-xs text-slate-500 dark:text-slate-400", children: "Miembro" })
  ] });
};
const groupSchema = objectType({
  name: stringType().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre es demasiado largo")
});
const GroupsPage = () => {
  var _a, _b;
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [showCreateForm, setShowCreateForm] = reactExports.useState(false);
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);
  const searchParam = params.get("search") ?? "";
  const debouncedSearch = useDebouncedValue(searchParam, 500);
  const query = usePaginatedQuery({
    queryKey: ["groups", { page, size, search: debouncedSearch }],
    queryFn: (signal) => fetchGroups({ page, size, search: debouncedSearch }, signal)
  });
  const createMutation = useMutation({
    mutationFn: (data) => createGroup(data),
    onSuccess: () => {
      pushToast({ type: "success", title: "Grupo creado", description: "El grupo ha sido creado exitosamente." });
      setShowCreateForm(false);
      reset();
      query.refetch();
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error al crear grupo", description: error.message || "No se pudo crear el grupo" });
    }
  });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: t(groupSchema)
  });
  const groups = ((_a = query.data) == null ? void 0 : _a.content) ?? [];
  const canCreateGroups = user && (user.role === "ADMIN" || user.role === "SERVER");
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
  const handleJoin = async (groupId) => {
    if (!user)
      return;
    try {
      await joinGroup(groupId, { userId: user.id });
      pushToast({ type: "success", title: "Unido al grupo", description: "Ahora formas parte de la conversación." });
      query.refetch();
    } catch (error) {
      pushToast({ type: "error", title: "No se pudo unir", description: error.message });
    }
  };
  const onSubmit = (data) => {
    createMutation.mutate(data);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Grupos" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold gradient-text", children: "Comunidades Activas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1", children: "Únete a grupos que coinciden con tus intereses o crea uno nuevo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Buscar grupo",
            placeholder: "Nombre del grupo",
            value: searchParam,
            onChange: (event) => updateParam("search", event.target.value || void 0)
          }
        ) }),
        canCreateGroups && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowCreateForm(!showCreateForm),
            className: "btn-primary whitespace-nowrap inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-5 w-5" }),
              "Crear Grupo"
            ]
          }
        )
      ] })
    ] }),
    showCreateForm && canCreateGroups && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/10 dark:to-slate-900/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white mb-2", children: "Crear Nuevo Grupo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Nombre del Grupo",
            placeholder: "Ej: Estudiantes de Ingeniería",
            ...register("name"),
            error: (_b = errors.name) == null ? void 0 : _b.message,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { disabled: createMutation.isLoading, className: "flex-1 sm:flex-none", children: createMutation.isLoading ? "Creando..." : "Crear Grupo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setShowCreateForm(false);
              reset();
            },
            className: "btn-secondary",
            children: "Cancelar"
          }
        )
      ] })
    ] }) }),
    query.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando grupos" }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "Sin grupos",
        description: canCreateGroups ? "Crea tu primer grupo para comenzar a organizar comunidades." : "Aún no hay grupos disponibles. Contacta a un administrador para crear uno."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: groups.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsx(GroupCard, { group, onJoin: handleJoin }, group.id)) }),
      query.data && query.data.totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
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
  GroupsPage as default
};
