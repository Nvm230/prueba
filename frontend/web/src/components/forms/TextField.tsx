import { forwardRef } from 'react';
import classNames from 'classnames';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const TextField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, required, ...props }, ref) => (
    <label className="block text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </span>
      <input
        ref={ref}
        className={classNames(
          'input-field',
          error && 'border-error-400 focus:ring-error-400 focus:border-error-400',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || label}-error` : undefined}
        {...props}
      />
      {hint && !error && <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
      {error && (
        <span id={`${props.id || label}-error`} className="mt-1 block text-xs text-error-500 font-medium" role="alert">
          {error}
        </span>
      )}
    </label>
  )
);

TextField.displayName = 'TextField';

export default TextField;
