import { forwardRef } from 'react';
import classNames from 'classnames';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const TextField = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className, ...props }, ref) => (
  <label className="block text-sm">
    <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
    <input
      ref={ref}
      className={classNames(
        'mt-1 w-full rounded-lg border border-slate-200 bg-white/70 dark:bg-slate-900/60 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500',
        error && 'border-red-400 focus:ring-red-400',
        className
      )}
      {...props}
    />
    {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
  </label>
));

TextField.displayName = 'TextField';

export default TextField;
