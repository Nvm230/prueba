import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage, themeStorageKey } from '@/utils/storage';

type Theme = 'light' | 'dark';

const PRIMARY_COLOR_STORAGE_KEY = 'univibe_primary_color';
const DEFAULT_PRIMARY_COLOR = '#9333EA'; // Morado por defecto

type ThemeContextValue = {
  theme: Theme;
  primaryColor: string;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Función para generar variaciones de color
const generateColorVariations = (baseColor: string) => {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const variations: Record<string, string> = {
    DEFAULT: baseColor,
    50: `rgb(${Math.min(255, r + 205)}, ${Math.min(255, g + 205)}, ${Math.min(255, b + 205)})`,
    100: `rgb(${Math.min(255, r + 180)}, ${Math.min(255, g + 180)}, ${Math.min(255, b + 180)})`,
    200: `rgb(${Math.min(255, r + 140)}, ${Math.min(255, g + 140)}, ${Math.min(255, b + 140)})`,
    300: `rgb(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)})`,
    400: `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`,
    500: baseColor,
    600: `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`,
    700: `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`,
    800: `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`,
    900: `rgb(${Math.max(0, r - 80)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)})`,
  };

  return variations;
};

// Función para aplicar el color primario al CSS
const applyPrimaryColor = (color: string) => {
  const root = document.documentElement;
  const variations = generateColorVariations(color);
  
  Object.entries(variations).forEach(([key, value]) => {
    if (key === 'DEFAULT') {
      root.style.setProperty('--color-primary', value);
    } else {
      root.style.setProperty(`--color-primary-${key}`, value);
    }
  });
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = storage.get(themeStorageKey) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    const stored = storage.get(PRIMARY_COLOR_STORAGE_KEY) as string | null;
    return stored || DEFAULT_PRIMARY_COLOR;
  });

  useEffect(() => {
    storage.set(themeStorageKey, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    storage.set(PRIMARY_COLOR_STORAGE_KEY, primaryColor);
    applyPrimaryColor(primaryColor);
  }, [primaryColor]);

  // Aplicar color al cargar
  useEffect(() => {
    applyPrimaryColor(primaryColor);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      primaryColor,
      toggleTheme: () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
      setTheme: (value: Theme) => setThemeState(value),
      setPrimaryColor: (color: string) => setPrimaryColorState(color)
    }),
    [theme, primaryColor]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
