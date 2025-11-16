import { r as reactExports, f as apiClient, g as useToast, j as jsxRuntimeExports, Q as QrCodeIcon } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { u as useMutation } from "./useMutation-64b1a4ee.js";
import "./utils-814f13d4.js";
function CheckCircleIcon({
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
    d: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  }));
}
const ForwardRef$1 = /* @__PURE__ */ reactExports.forwardRef(CheckCircleIcon);
const CheckCircleIcon$1 = ForwardRef$1;
function XCircleIcon({
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
    d: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(XCircleIcon);
const XCircleIcon$1 = ForwardRef;
const checkInWithQR = (payload, signal) => apiClient.post("/api/registrations/check-in", { payload }, { signal }).then((res) => res.data);
const CheckInPage = () => {
  const { pushToast } = useToast();
  const [qrPayload, setQrPayload] = reactExports.useState("");
  const [checkInResult, setCheckInResult] = reactExports.useState(null);
  const mutation = useMutation({
    mutationFn: (payload) => checkInWithQR(payload),
    onSuccess: (data) => {
      setCheckInResult({
        success: true,
        message: `Check-in exitoso. Estado: ${data.status}`
      });
      pushToast({
        type: "success",
        title: "Check-in Exitoso",
        description: `Registrado a las ${new Date(data.checkedInAt).toLocaleString()}`
      });
      setQrPayload("");
    },
    onError: (error) => {
      setCheckInResult({
        success: false,
        message: error.message || "Error al procesar el check-in"
      });
      pushToast({
        type: "error",
        title: "Error en Check-in",
        description: error.message || "No se pudo procesar el código QR"
      });
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qrPayload.trim()) {
      pushToast({
        type: "info",
        title: "Campo requerido",
        description: "Por favor ingresa el código QR"
      });
      return;
    }
    mutation.mutate(qrPayload);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Check-in" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCodeIcon, { className: "h-6 w-6 text-primary-600 dark:text-primary-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: "Check-in con QR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Escanea o ingresa el código QR del participante para registrar su asistencia" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2", children: "Código QR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: qrPayload,
              onChange: (e) => {
                setQrPayload(e.target.value);
                setCheckInResult(null);
              },
              placeholder: "Pega aquí el código QR del participante...",
              rows: 6,
              className: "input-field font-mono text-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: "El código QR debe ser el payload completo generado durante el registro" })
        ] }),
        checkInResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl p-4 flex items-start gap-3 ${checkInResult.success ? "bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800" : "bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800"}`,
            children: [
              checkInResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCircleIcon$1, { className: "h-5 w-5 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(XCircleIcon$1, { className: "h-5 w-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: `text-sm font-medium ${checkInResult.success ? "text-success-900 dark:text-success-200" : "text-error-900 dark:text-error-200"}`,
                  children: checkInResult.message
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubmitButton,
          {
            type: "submit",
            className: "w-full",
            disabled: mutation.isLoading || !qrPayload.trim(),
            children: mutation.isLoading ? "Procesando..." : "Registrar Check-in"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-6 border-t border-slate-200 dark:border-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-900 dark:text-white mb-2", children: "Instrucciones" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-slate-600 dark:text-slate-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-600 dark:text-primary-400", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Escanea el código QR del participante usando un escáner QR" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-600 dark:text-primary-400", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "O copia y pega el payload completo del código QR" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-600 dark:text-primary-400", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "El sistema validará automáticamente el código y registrará la asistencia" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  CheckInPage as default
};
