import { r as reactExports, u as useAuth, g as useToast, i as useQueryClient, j as jsxRuntimeExports, L as LoadingOverlay } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { E as EmptyState } from "./EmptyState-cbe24938.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SelectField } from "./SelectField-59bf6ec7.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { f as fetchSurveyAnswers, c as createSurvey, a as answerSurveyQuestion, b as fetchSurveys, d as closeSurvey } from "./surveyService-252277d9.js";
import { f as fetchEvents } from "./eventService-3ce97835.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import "./utils-814f13d4.js";
function EyeIcon({
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
    d: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
  }), /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(EyeIcon);
const EyeIcon$1 = ForwardRef$1;
function LockClosedIcon({
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
    d: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(LockClosedIcon);
const LockClosedIcon$1 = ForwardRef;
const SurveyPage = () => {
  var _a;
  const { user } = useAuth();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = reactExports.useState({});
  const [viewingAnswers, setViewingAnswers] = reactExports.useState({});
  const surveyQuery = useQuery({
    queryKey: ["surveys"],
    queryFn: ({ signal }) => fetchSurveys({}, signal)
  });
  const canManageSurveys = user && (user.role === "ADMIN" || user.role === "SERVER");
  const eventsQuery = useQuery({
    queryKey: ["events", "all"],
    queryFn: ({ signal }) => fetchEvents({ page: 0, size: 1e3 }, signal),
    enabled: canManageSurveys,
    select: (data) => ({
      ...data,
      content: data.content.filter((event) => event.status === "PENDING" || event.status === "LIVE")
    })
  });
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (values) => {
    var _a2, _b;
    try {
      const questions = values.questions.split("\n").map((question) => question.trim()).filter(Boolean);
      if (questions.length === 0) {
        pushToast({ type: "error", title: "Error", description: "Debes agregar al menos una pregunta" });
        return;
      }
      await createSurvey({ eventId: Number(values.eventId), title: values.title, questions });
      pushToast({ type: "success", title: "Encuesta creada", description: "Listo para recolectar feedback." });
      reset();
      surveyQuery.refetch();
    } catch (error) {
      const errorMessage = ((_b = (_a2 = error == null ? void 0 : error.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || (error == null ? void 0 : error.message) || "Error desconocido al crear la encuesta";
      pushToast({
        type: "error",
        title: "No se pudo crear",
        description: errorMessage
      });
      console.error("Error creating survey:", error);
    }
  };
  const submitAnswer = async (questionId) => {
    if (!user)
      return;
    const answer = answers[questionId];
    if (!answer) {
      pushToast({ type: "info", title: "Respuesta requerida", description: "Escribe tu opinión antes de enviar." });
      return;
    }
    try {
      await answerSurveyQuestion(questionId, { answer });
      pushToast({ type: "success", title: "Respuesta enviada", description: "Gracias por participar." });
      setAnswers((prev) => ({ ...prev, [questionId]: "" }));
      surveyQuery.refetch();
    } catch (error) {
      pushToast({ type: "error", title: "Error al responder", description: error.message });
    }
  };
  const closeSurveyMutation = useMutation({
    mutationFn: (surveyId) => closeSurvey(surveyId),
    onSuccess: () => {
      pushToast({ type: "success", title: "Encuesta cerrada", description: "Ya no se pueden enviar más respuestas." });
      surveyQuery.refetch();
    },
    onError: (error) => {
      pushToast({ type: "error", title: "Error", description: error.message });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Encuestas" }] }),
    (user == null ? void 0 : user.role) !== "USER" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: "Crear nueva encuesta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Diseña encuestas para tus eventos activos. Cada pregunta debe ir en una línea separada." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-4 grid gap-4 md:grid-cols-2", onSubmit: handleSubmit(onSubmit), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectField,
          {
            label: "Evento",
            ...register("eventId", { required: true, valueAsNumber: true }),
            required: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecciona un evento" }),
              (_a = eventsQuery.data) == null ? void 0 : _a.content.map((event) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: event.id, children: event.title }, event.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextField, { label: "Título", ...register("title", { required: true }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "md:col-span-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: "Preguntas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              rows: 4,
              className: "mt-1 w-full rounded-lg border border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500",
              placeholder: "¿Qué te pareció el evento?\n¿Qué mejorarías?",
              ...register("questions", { required: true })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { className: "md:col-span-2 w-full md:w-auto", children: "Crear encuesta" })
      ] })
    ] }),
    surveyQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando encuestas" }) : surveyQuery.data && surveyQuery.data.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: surveyQuery.data.map((survey) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-soft space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: survey.title }),
              survey.event && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
                "Evento: ",
                survey.event.title
              ] }),
              !survey.event && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Encuesta de grupo" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              survey.closed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LockClosedIcon$1, { className: "h-3 w-3" }),
                "Cerrada"
              ] }),
              canManageSurveys && !survey.closed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => closeSurveyMutation.mutate(survey.id),
                  disabled: closeSurveyMutation.isLoading,
                  className: "btn-secondary text-xs px-3 py-1",
                  children: "Cerrar"
                }
              )
            ] })
          ] }),
          survey.questions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Esta encuesta aún no tiene preguntas." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: survey.questions.map((question) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: question.text }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
              "Respuestas registradas: ",
              question.answers.length
            ] }),
            canManageSurveys && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setViewingAnswers((prev) => ({ ...prev, [question.id]: !prev[question.id] }));
                  if (!viewingAnswers[question.id]) {
                    queryClient.fetchQuery({
                      queryKey: ["surveyAnswers", survey.id],
                      queryFn: ({ signal }) => fetchSurveyAnswers(survey.id, signal)
                    });
                  }
                },
                className: "mt-2 inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EyeIcon$1, { className: "h-4 w-4" }),
                  viewingAnswers[question.id] ? "Ocultar respuestas" : "Ver respuestas"
                ]
              }
            ),
            viewingAnswers[question.id] && canManageSurveys && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3", children: question.answers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Aún no hay respuestas" }) : question.answers.map((answer) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700 dark:text-slate-300", children: [
                answer.respondent.name,
                ":"
              ] }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600 dark:text-slate-400", children: answer.answer })
            ] }, answer.id)) }),
            !survey.closed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-col gap-2 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: answers[question.id] ?? "",
                  onChange: (event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value })),
                  className: "flex-1 rounded-full border border-slate-200 bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700",
                  placeholder: "Escribe tu respuesta",
                  disabled: survey.closed
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SubmitButton,
                {
                  type: "button",
                  onClick: () => submitAnswer(question.id),
                  className: "sm:w-auto",
                  disabled: survey.closed,
                  children: "Enviar"
                }
              )
            ] }),
            survey.closed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400 italic", children: "Esta encuesta está cerrada. Ya no se pueden enviar más respuestas." })
          ] }, question.id)) })
        ]
      },
      survey.id
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Sin encuestas", description: "Crea una nueva encuesta para comenzar a recolectar insights." })
  ] });
};
export {
  SurveyPage as default
};
