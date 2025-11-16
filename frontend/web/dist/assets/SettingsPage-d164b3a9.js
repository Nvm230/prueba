import { n as useTheme, u as useAuth, j as jsxRuntimeExports } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Configuración" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-6 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-slate-900 dark:text-white", children: "Preferencias generales" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Personaliza tu experiencia en UniVibe." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: "Tema" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Alterna entre modo claro y oscuro." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setTheme("light"),
                className: `rounded-full px-4 py-1 text-sm ${theme === "light" ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`,
                children: "Claro"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setTheme("dark"),
                className: `rounded-full px-4 py-1 text-sm ${theme === "dark" ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`,
                children: "Oscuro"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-500/10 px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-rose-700 dark:text-rose-200", children: "Cerrar sesión" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-600 dark:text-rose-300", children: "Finaliza tu sesión actual de forma segura." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { onClick: logout, className: "mt-3 bg-rose-600 hover:bg-rose-500", children: "Cerrar sesión" })
        ] })
      ] })
    ] })
  ] });
};
export {
  SettingsPage as default
};
