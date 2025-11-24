import { createContext, useContext, useMemo } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';

interface ToastOptions {
  title: string;
  message?: string;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const value = useMemo(
    () => ({
      show: ({ title, message }: ToastOptions) => {
        if (Platform.OS === 'android') {
          ToastAndroid.show(`${title}${message ? `\n${message}` : ''}`, ToastAndroid.SHORT);
        } else {
          Alert.alert(title, message);
        }
      }
    }),
    []
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
