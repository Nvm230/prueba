import { forwardRef } from 'react';
import classNames from 'classnames';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(({ label, error, className, children, ...props }, ref) => (
  <label className="block text-sm">
    {label && <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    <select
      ref={ref}
      className={classNames(
        'mt-1 w-full rounded-lg border border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
        error && 'border-red-400 focus:ring-red-400',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
  </label>
));

SelectField.displayName = 'SelectField';

export default SelectField;
