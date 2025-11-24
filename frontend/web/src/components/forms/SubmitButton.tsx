import classNames from 'classnames';
import { useTheme } from '@/contexts/ThemeContext';
import { shouldUseWhiteText, darkenColor } from '@/utils/colorContrast';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const SubmitButton: React.FC<Props> = ({ loading, children, className, disabled, ...props }) => {
  const { theme, primaryColor } = useTheme();
  const useWhiteText = shouldUseWhiteText(primaryColor);
  const buttonColor = theme === 'dark' ? darkenColor(primaryColor, 40) : primaryColor;
  const hoverColor = theme === 'dark' ? darkenColor(primaryColor, 50) : darkenColor(primaryColor, 20);
  
  return (
    <button
      type="submit"
      className={classNames(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold shadow-soft transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        className
      )}
      style={{
        backgroundColor: buttonColor,
        color: useWhiteText ? '#ffffff' : '#1f2937',
        '--hover-color': hoverColor,
      } as React.CSSProperties & { '--hover-color': string }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = buttonColor;
      }}
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
};

export default SubmitButton;
