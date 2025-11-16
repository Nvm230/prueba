import { u as useAuth, j as jsxRuntimeExports, U as UserPlusIcon, a as Link } from "./index-74821ec3.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { o as objectType, s as stringType, t } from "./types-b8c6b9bb.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
const schema = objectType({
  name: stringType().min(3, "Tu nombre debe tener al menos 3 caracteres").max(100, "El nombre es demasiado largo"),
  email: stringType().email("Ingresa un correo válido"),
  password: stringType().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: stringType().min(1, "Confirma tu contraseña")
}).refine((values) => values.password === values.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});
const RegisterPage = () => {
  var _a, _b, _c, _d;
  const { register: registerUser, handleSubmit, formState } = useForm({
    resolver: t(schema)
  });
  const { register: registerAuth, isAuthenticating } = useAuth();
  const onSubmit = async (values) => {
    await registerAuth({ name: values.name, email: values.email, password: values.password });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-primary-200 dark:border-primary-800 shadow-soft-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlusIcon, { className: "h-8 w-8 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold gradient-text mb-2", children: "Crea tu cuenta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Únete a la plataforma de experiencias universitarias" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: handleSubmit(onSubmit), noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TextField,
        {
          label: "Nombre completo",
          placeholder: "Juan Pérez",
          error: (_a = formState.errors.name) == null ? void 0 : _a.message,
          ...registerUser("name"),
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TextField,
        {
          label: "Correo electrónico",
          type: "email",
          placeholder: "tu@correo.com",
          error: (_b = formState.errors.email) == null ? void 0 : _b.message,
          ...registerUser("email"),
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TextField,
        {
          label: "Contraseña",
          type: "password",
          placeholder: "••••••••",
          error: (_c = formState.errors.password) == null ? void 0 : _c.message,
          ...registerUser("password"),
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TextField,
        {
          label: "Confirmar contraseña",
          type: "password",
          placeholder: "••••••••",
          error: (_d = formState.errors.confirmPassword) == null ? void 0 : _d.message,
          ...registerUser("confirmPassword"),
          required: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { loading: isAuthenticating, className: "w-full", children: "Crear cuenta" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-slate-600 dark:text-slate-400", children: [
      "¿Ya tienes una cuenta?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          className: "font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors",
          children: "Inicia sesión aquí"
        }
      )
    ] })
  ] }) }) }) });
};
export {
  RegisterPage as default
};
