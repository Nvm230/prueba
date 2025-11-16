import { forwardRef } from 'react';
import classNames from 'classnames';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
}

const SelectField = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, className, children, required, ...props }, ref) => (
    <label className="block text-sm">
      {label && (
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </span>
      )}
      <select
        ref={ref}
        className={classNames(
          'input-field',
          error && 'border-error-400 focus:ring-error-400 focus:border-error-400',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || label}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span id={`${props.id || label}-error`} className="mt-1 block text-xs text-error-500 font-medium" role="alert">
          {error}
        </span>
      )}
    </label>
  )
);

SelectField.displayName = 'SelectField';

export default SelectField;
