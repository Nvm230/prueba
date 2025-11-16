import { j as jsxRuntimeExports, a as Link } from "./index-74821ec3.js";
const Breadcrumbs = ({ items }) => /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "text-xs uppercase tracking-wide text-slate-400", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-center gap-2", children: items.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
  item.to ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.to, className: "hover:text-primary-500", children: item.label }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 dark:text-slate-300", children: item.label }),
  index + 1 < items.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" })
] }, item.label)) }) });
export {
  Breadcrumbs as B
};
