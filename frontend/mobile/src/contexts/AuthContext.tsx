import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest, fetchProfile } from '@/services/authService';
import { User } from '@/types';
import { tokenStorage } from '@/utils/storage';
import { useToast } from '@/contexts/ToastContext';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  const bootstrap = useCallback(async () => {
    try {
      const token = await tokenStorage.get();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile = await fetchProfile();
      setUser(profile);
    } catch (error) {
      await tokenStorage.remove();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      setLoading(true);
      try {
        const { token } = await loginRequest(payload.email, payload.password);
        await tokenStorage.set(token);
        const profile = await fetchProfile();
        setUser(profile);
        show({ title: 'Bienvenido', message: profile.name });
      } catch (error: any) {
        show({ title: 'Error de inicio de sesión', message: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [show]
  );

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      setLoading(true);
      try {
        const { token } = await registerRequest(payload);
        await tokenStorage.set(token);
        const profile = await fetchProfile();
        setUser(profile);
        show({ title: 'Cuenta creada', message: 'Tu perfil está listo.' });
      } catch (error: any) {
        show({ title: 'Error de registro', message: error.message });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [show]
  );

  const logout = useCallback(async () => {
    await tokenStorage.remove();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchProfile();
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshProfile }),
    [user, loading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
