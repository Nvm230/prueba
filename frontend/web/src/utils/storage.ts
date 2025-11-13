const PREFIX = 'univibe';

const isBrowser = typeof window !== 'undefined';

export const storage = {
  get(key: string) {
    if (!isBrowser) return null;
    return window.localStorage.getItem(`${PREFIX}:${key}`);
  },
  set(key: string, value: string) {
    if (!isBrowser) return;
    window.localStorage.setItem(`${PREFIX}:${key}`, value);
  },
  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(`${PREFIX}:${key}`);
  }
};

export const tokenStorageKey = 'token';
export const themeStorageKey = 'theme';
