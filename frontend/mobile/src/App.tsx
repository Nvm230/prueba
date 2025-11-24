import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ProximityProvider } from '@/contexts/ProximityContext';
import { SensorProvider } from '@/contexts/SensorContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const Root = () => {
  const { theme } = useTheme();
  const navigationTheme = useMemo(() => (theme === 'dark' ? DarkTheme : DefaultTheme), [theme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <SensorProvider>
              <ProximityProvider>
                <Root />
              </ProximityProvider>
            </SensorProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
