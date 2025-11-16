import { j as jsxRuntimeExports } from "./index-74821ec3.js";
const EmptyState = ({ title, description, action }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-transparent p-10 text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: title }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-500 dark:text-slate-400", children: description }),
  action && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-center", children: action })
] });
export {
  EmptyState as E
};
