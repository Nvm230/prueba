import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storage, tokenStorageKey } from '@/utils/storage';
import { fetchProfile, login as loginRequest, register as registerRequest } from '@/services/authService';
import { User } from '@/types';
import { useToast } from './ToastContext';
import { presenceService } from '@/services/presenceService';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticating: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => storage.get(tokenStorageKey));
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { pushToast } = useToast();

  const bootstrap = useCallback(async () => {
    const storedToken = storage.get(tokenStorageKey);
    if (!storedToken) {
      setUser(null);
      setTokenState(null);
      return;
    }
    try {
      setIsAuthenticating(true);
      const profile = await fetchProfile();
      setUser(profile);
      setTokenState(storedToken);
    } catch (error) {
      storage.remove(tokenStorageKey);
      setUser(null);
      setTokenState(null);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (user) {
      const disconnectPresence = presenceService.connect(() => {});
      return () => {
        disconnectPresence();
      };
    } else {
      presenceService.disconnect();
    }
  }, [user]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsAuthenticating(true);
      try {
        const { token: receivedToken } = await loginRequest(email, password);
        storage.set(tokenStorageKey, receivedToken);
        setTokenState(receivedToken);
        const profile = await fetchProfile();
        setUser(profile);
        pushToast({ type: 'success', title: 'Welcome back', description: `Hola ${profile.name}!` });
      } catch (error: any) {
        pushToast({ type: 'error', title: 'Login failed', description: error.message });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [pushToast]
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      setIsAuthenticating(true);
      try {
        const { token: receivedToken } = await registerRequest(payload);
        storage.set(tokenStorageKey, receivedToken);
        setTokenState(receivedToken);
        const profile = await fetchProfile();
        setUser(profile);
        pushToast({ type: 'success', title: 'Cuenta creada', description: 'Tu perfil está listo.' });
      } catch (error: any) {
        pushToast({ type: 'error', title: 'Registro fallido', description: error.message });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [pushToast]
  );

  const logout = useCallback(() => {
    storage.remove(tokenStorageKey);
    setUser(null);
    setTokenState(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await fetchProfile();
    setUser(profile);
  }, [token]);

  const setToken = useCallback(async (newToken: string) => {
    storage.set(tokenStorageKey, newToken);
    setTokenState(newToken);
    try {
      const profile = await fetchProfile();
      setUser(profile);
      pushToast({ type: 'success', title: 'Sesión iniciada', description: `Bienvenido ${profile.name}!` });
    } catch (error: any) {
      storage.remove(tokenStorageKey);
      setTokenState(null);
      setUser(null);
      pushToast({ type: 'error', title: 'Error', description: error.message || 'Error al cargar el perfil' });
      throw error;
    }
  }, [pushToast]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticating,
      login,
      register,
      logout,
      refreshProfile,
      setToken
    }),
    [isAuthenticating, login, logout, refreshProfile, register, setToken, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};
