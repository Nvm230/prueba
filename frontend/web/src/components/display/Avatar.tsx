import { User } from '@/types';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

interface AvatarProps {
  user?: User | { name: string; profilePictureUrl?: string };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnline?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-2xl'
};

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className, showOnline }) => {
  const sizeClass = sizeClasses[size];
  const hasPicture = user?.profilePictureUrl;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (hasPicture) {
    return (
      <div className={classNames('relative inline-flex items-center justify-center', className)}>
        <img
          src={user.profilePictureUrl}
          alt={user.name}
          className={classNames(
            'rounded-full object-cover border-2 border-white dark:border-slate-800',
            sizeClass
          )}
          onError={(e) => {
            // Fallback a iniciales si la imagen falla
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="${sizeClass} rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white dark:border-slate-800">
                  ${getInitials(user.name)}
                </div>
              `;
            }
          }}
        />
        {showOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white dark:border-slate-800 rounded-full" />
        )}
      </div>
    );
  }

  return (
    <div className={classNames('relative inline-flex items-center justify-center', className)}>
      <div
        className={classNames(
          'rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white dark:border-slate-800 shadow-md',
          sizeClass
        )}
      >
        {user ? getInitials(user.name) : <UserCircleIcon className="h-full w-full" />}
      </div>
      {showOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 bg-success-500 border-2 border-white dark:border-slate-800 rounded-full" />
      )}
    </div>
  );
};

export default Avatar;







