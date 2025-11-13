import classNames from 'classnames';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const SubmitButton: React.FC<Props> = ({ loading, children, className, disabled, ...props }) => (
  <button
    type="submit"
    className={classNames(
      'inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed',
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    )}
    {children}
  </button>
);

export default SubmitButton;
