import { l as useNavigate, i as useQueryClient, g as useToast, u as useAuth, j as jsxRuntimeExports } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { o as objectType, s as stringType, t } from "./types-b8c6b9bb.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { c as createEvent } from "./eventService-3ce97835.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import { P as PlusIcon } from "./PlusIcon-34f32654.js";
import "./utils-814f13d4.js";
const eventSchema = objectType({
  title: stringType().min(3, "El título debe tener al menos 3 caracteres").max(200, "El título es demasiado largo"),
  category: stringType().min(1, "Selecciona una categoría"),
  description: stringType().min(10, "La descripción debe tener al menos 10 caracteres").max(1e3, "La descripción es demasiado larga"),
  faculty: stringType().optional(),
  career: stringType().optional(),
  startTime: stringType().min(1, "La fecha de inicio es requerida"),
  endTime: stringType().min(1, "La fecha de fin es requerida")
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio",
  path: ["endTime"]
});
const categories = [
  "Technology",
  "Wellness",
  "Sports",
  "Entrepreneurship",
  "Art",
  "Science",
  "Education",
  "Networking",
  "Workshop",
  "Conference"
];
const CreateEventPage = () => {
  var _a, _b, _c, _d, _e, _f;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: t(eventSchema),
    defaultValues: {
      category: ""
    }
  });
  const mutation = useMutation({
    mutationFn: (data) => createEvent(data),
    onSuccess: (event) => {
      pushToast({
        type: "success",
        title: "Evento creado",
        description: "El evento ha sido creado exitosamente."
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate(`/events/${event.id}`);
    },
    onError: (error) => {
      var _a2, _b2;
      const errorMessage = ((_b2 = (_a2 = error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b2.message) || error.message || "No se pudo crear el evento. Intenta nuevamente.";
      pushToast({
        type: "error",
        title: "Error al crear evento",
        description: errorMessage
      });
      console.error("Error creating event:", error);
    }
  });
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      // Asegurar que campos opcionales sean null en lugar de string vacío
      faculty: data.faculty || null,
      career: data.career || null
    };
    mutation.mutate(payload);
  };
  if (!user || user.role !== "ADMIN" && user.role !== "SERVER") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Eventos", to: "/events" }, { label: "Crear Evento" }] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-slate-900 dark:text-white mb-2", children: "Acceso Restringido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-600 dark:text-slate-400", children: "Solo los administradores y servidores pueden crear eventos." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Eventos", to: "/events" }, { label: "Crear Evento" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Crear Nuevo Evento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Completa el formulario para crear un nuevo evento universitario" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Título del Evento",
              placeholder: "Ej: Taller de Programación Web",
              ...register("title"),
              error: (_a = errors.title) == null ? void 0 : _a.message,
              required: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            SelectField,
            {
              label: "Categoría",
              ...register("category"),
              error: (_b = errors.category) == null ? void 0 : _b.message,
              required: true,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona una categoría" }),
                categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: cat, children: cat }, cat))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2", children: [
              "Descripción ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-error-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                ...register("description"),
                rows: 5,
                className: "input-field",
                placeholder: "Describe el evento, sus objetivos y qué aprenderán los participantes..."
              }
            ),
            errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-error-500", children: errors.description.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Facultad",
              placeholder: "Ej: Facultad de Ingeniería",
              ...register("faculty"),
              error: (_c = errors.faculty) == null ? void 0 : _c.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Carrera",
              placeholder: "Ej: Ingeniería en Informática",
              ...register("career"),
              error: (_d = errors.career) == null ? void 0 : _d.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Fecha y Hora de Inicio",
              type: "datetime-local",
              ...register("startTime"),
              error: (_e = errors.startTime) == null ? void 0 : _e.message,
              required: true
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextField,
            {
              label: "Fecha y Hora de Fin",
              type: "datetime-local",
              ...register("endTime"),
              error: (_f = errors.endTime) == null ? void 0 : _f.message,
              required: true
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate("/events"),
              className: "btn-secondary flex-1 sm:flex-none",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SubmitButton,
            {
              className: "flex-1 sm:flex-none",
              disabled: isSubmitting || mutation.isLoading,
              children: mutation.isLoading ? "Creando..." : "Crear Evento"
            }
          )
        ] })
      ] })
    ] })
  ] });
};
export {
  CreateEventPage as default
};
