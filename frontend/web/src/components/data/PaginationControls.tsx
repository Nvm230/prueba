import { PAGINATION_SIZES } from '@/utils/constants';

interface Props {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange?: (size: number) => void;
}

const PaginationControls: React.FC<Props> = ({ page, size, totalPages, totalElements, onPageChange, onSizeChange }) => {
  const start = page * size + 1;
  const end = Math.min(totalElements, (page + 1) * size);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500 dark:text-slate-300">
      <div>
        Showing <span className="font-semibold text-slate-700 dark:text-slate-100">{start}</span> -{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-100">{end}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-100">{totalElements}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-xs uppercase tracking-wide">
            Page size
          </label>
          <select
            id="page-size"
            className="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700"
            value={size}
            onChange={(event) => onSizeChange?.(Number(event.target.value))}
          >
            {PAGINATION_SIZES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page + 1} / {Math.max(totalPages, 1)}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
