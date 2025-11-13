import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '@/hooks/useAuth';
import classNames from 'classnames';

const UserMenu = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 px-3 py-1.5 text-sm font-medium">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm">{initials}</span>
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-slate-900 dark:text-slate-100">{user.name}</span>
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
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg focus:outline-none">
          <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
            Signed in as
            <div className="text-slate-900 dark:text-slate-100 text-sm">{user.email}</div>
          </div>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                className={classNames(
                  'w-full px-4 py-2 text-left text-sm rounded-b-xl',
                  active ? 'bg-primary-50 dark:bg-primary-600/10 text-primary-600 dark:text-primary-200' : 'text-slate-600 dark:text-slate-200'
                )}
                onClick={logout}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
