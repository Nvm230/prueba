import { j as jsxRuntimeExports, c as classNames } from "./index-74821ec3.js";
const SubmitButton = ({ loading, children, className, disabled, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  "button",
  {
    type: "submit",
    className: classNames(
      "inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
      className
    ),
    disabled: disabled || loading,
    ...props,
    children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })
      ] }),
      children
    ]
  }
);
export {
  SubmitButton as S
};
