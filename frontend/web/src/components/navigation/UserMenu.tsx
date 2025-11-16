import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import Avatar from '@/components/display/Avatar';
import classNames from 'classnames';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const UserMenu = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-3 py-1.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <Avatar user={user} size="sm" />
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-slate-900 dark:text-slate-100 font-medium">{user.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{user.role}</span>
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-soft-lg focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/profile"
                  className={classNames(
                    'flex items-center gap-3 w-full px-4 py-2 text-sm',
                    active
                      ? 'bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-200'
                      : 'text-slate-700 dark:text-slate-200'
                  )}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Mi Perfil
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={logout}
                  className={classNames(
                    'flex items-center gap-3 w-full px-4 py-2 text-sm rounded-b-xl',
                    active
                      ? 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400'
                      : 'text-slate-700 dark:text-slate-200'
                  )}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Cerrar Sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
