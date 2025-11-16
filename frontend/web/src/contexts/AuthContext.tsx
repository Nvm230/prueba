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
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => storage.get(tokenStorageKey));
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { pushToast } = useToast();

  const bootstrap = useCallback(async () => {
    const storedToken = storage.get(tokenStorageKey);
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      setIsAuthenticating(true);
      const profile = await fetchProfile();
      setUser(profile);
      setToken(storedToken);
    } catch (error) {
      storage.remove(tokenStorageKey);
      setUser(null);
      setToken(null);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Inicializar servicio de presencia cuando el usuario está autenticado
  useEffect(() => {
    if (user) {
      // Conectar al servicio de presencia (sin callback específico, solo para mantener la conexión)
      const disconnectPresence = presenceService.connect(() => {});
      return () => {
        disconnectPresence();
      };
    } else {
      // Desconectar si el usuario cierra sesión
      presenceService.disconnect();
    }
  }, [user]);

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setIsAuthenticating(true);
      try {
        const { token: receivedToken } = await loginRequest(email, password);
        storage.set(tokenStorageKey, receivedToken);
        setToken(receivedToken);
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
        setToken(receivedToken);
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
    setToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await fetchProfile();
    setUser(profile);
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticating,
      login,
      register,
      logout,
      refreshProfile
    }),
    [isAuthenticating, login, logout, refreshProfile, register, token, user]
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
