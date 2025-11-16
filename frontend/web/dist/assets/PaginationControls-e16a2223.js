import { j as jsxRuntimeExports, P as PAGINATION_SIZES } from "./index-74821ec3.js";
const PaginationControls = ({ page, size, totalPages, totalElements, onPageChange, onSizeChange }) => {
  const start = page * size + 1;
  const end = Math.min(totalElements, (page + 1) * size);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500 dark:text-slate-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      "Showing ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700 dark:text-slate-100", children: start }),
      " -",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700 dark:text-slate-100", children: end }),
      " of",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700 dark:text-slate-100", children: totalElements })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "page-size", className: "text-xs uppercase tracking-wide", children: "Page size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "page-size",
            className: "rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700",
            value: size,
            onChange: (event) => onSizeChange == null ? void 0 : onSizeChange(Number(event.target.value)),
            children: PAGINATION_SIZES.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onPageChange(Math.max(0, page - 1)),
            disabled: page === 0,
            className: "rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1 disabled:opacity-40",
            children: "Prev"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Page ",
          page + 1,
          " / ",
          Math.max(totalPages, 1)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onPageChange(Math.min(totalPages - 1, page + 1)),
            disabled: page + 1 >= totalPages,
            className: "rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1 disabled:opacity-40",
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
};
export {
  PaginationControls as P
};
