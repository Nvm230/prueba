import { u as useAuth, l as useNavigate, O as useLocation, r as reactExports, j as jsxRuntimeExports, a as Link } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { o as objectType, s as stringType, t } from "./types-b8c6b9bb.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { S as SparklesIcon } from "./SparklesIcon-5e13cb87.js";
const schema = objectType({
  email: stringType().email("Ingresa un correo válido"),
  password: stringType().min(6, "La contraseña debe tener al menos 6 caracteres")
});
const LoginPage = () => {
  var _a, _b;
  const { register, handleSubmit, formState } = useForm({ resolver: t(schema) });
  const { login, user, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  reactExports.useEffect(() => {
    var _a2, _b2;
    if (user) {
      const redirect = ((_b2 = (_a2 = location.state) == null ? void 0 : _a2.from) == null ? void 0 : _b2.pathname) ?? "/";
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, location.state]);
  const onSubmit = async (values) => {
    await login(values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SparklesIcon, { className: "h-12 w-12 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-5xl font-bold gradient-text mb-4", children: "Bienvenido a UniVibe" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-slate-600 dark:text-slate-400", children: "Gestiona eventos universitarios en un solo lugar. Conecta con tu comunidad, participa en eventos y mantente al día con todo lo que pasa en tu universidad." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gestiona y participa en eventos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Conecta con otros estudiantes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Únete a grupos y comunidades" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-primary-200 dark:border-primary-800 shadow-soft-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 md:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SparklesIcon, { className: "h-8 w-8 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold gradient-text mb-2", children: "Bienvenido a UniVibe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Gestiona eventos universitarios en un solo lugar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Correo electrónico",
            type: "email",
            placeholder: "tu@correo.com",
            error: (_a = formState.errors.email) == null ? void 0 : _a.message,
            ...register("email"),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Contraseña",
            type: "password",
            placeholder: "••••••••",
            error: (_b = formState.errors.password) == null ? void 0 : _b.message,
            ...register("password"),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { loading: isAuthenticating, className: "w-full", children: "Iniciar sesión" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-slate-600 dark:text-slate-400", children: [
        "¿Aún no tienes cuenta?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/register",
            className: "font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors",
            children: "Regístrate aquí"
          }
        )
      ] })
    ] }) })
  ] }) }) });
};
export {
  LoginPage as default
};
