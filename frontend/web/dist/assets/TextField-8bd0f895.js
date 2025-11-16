import { r as reactExports, j as jsxRuntimeExports, c as classNames } from "./index-74821ec3.js";
const TextField = reactExports.forwardRef(
  ({ label, error, hint, className, required, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700 dark:text-slate-200", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-error-500 ml-1", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref,
        className: classNames(
          "input-field",
          error && "border-error-400 focus:ring-error-400 focus:border-error-400",
          className
        ),
        "aria-invalid": error ? "true" : "false",
        "aria-describedby": error ? `${props.id || label}-error` : void 0,
        ...props
      }
    ),
    hint && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs text-slate-500 dark:text-slate-400", children: hint }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: `${props.id || label}-error`, className: "mt-1 block text-xs text-error-500 font-medium", role: "alert", children: error })
  ] })
);
TextField.displayName = "TextField";
export {
  TextField as T
};
