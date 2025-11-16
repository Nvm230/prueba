import { j as jsxRuntimeExports, c as classNames } from "./index-74821ec3.js";
const variants = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  LIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  FINISHED: "bg-slate-200 text-slate-700 dark:bg-slate-500/10 dark:text-slate-200"
};
const StatusBadge = ({ status }) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classNames("rounded-full px-3 py-1 text-xs font-medium", variants[status]), children: status });
export {
  StatusBadge as S
};
