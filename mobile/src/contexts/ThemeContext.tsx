import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface Theme {
    colors: {
        primary: string;
        primaryDark: string;
        primaryLight: string;
        background: string;
        surface: string;
        surfaceVariant: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        success: string;
        warning: string;
        card: string;
    };
    isDark: boolean;
}

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const lightTheme: Theme = {
    colors: {
        primary: '#8b5cf6',
        primaryDark: '#7c3aed',
        primaryLight: '#a78bfa',
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceVariant: '#f1f5f9',
        text: '#0f172a',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        card: '#ffffff',
    },
    isDark: false,
};

const darkTheme: Theme = {
    colors: {
        primary: '#a78bfa',
        primaryDark: '#8b5cf6',
        primaryLight: '#c4b5fd',
        background: '#0f172a',
        surface: '#1e293b',
        surfaceVariant: '#334155',
        text: '#f8fafc',
        textSecondary: '#cbd5e1',
        border: '#475569',
        error: '#f87171',
        success: '#34d399',
        warning: '#fbbf24',
        card: '#1e293b',
    },
    isDark: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
    const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        updateTheme();
    }, [themeMode, systemColorScheme]);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem('themeMode');
            if (saved) {
                setThemeModeState(saved as ThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem('themeMode', mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const updateTheme = () => {
        let shouldUseDark = false;

        if (themeMode === 'dark') {
            shouldUseDark = true;
        } else if (themeMode === 'auto') {
            shouldUseDark = systemColorScheme === 'dark';
        }

        setCurrentTheme(shouldUseDark ? darkTheme : lightTheme);
    };

    const toggleTheme = () => {
        const newMode = currentTheme.isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, themeMode, setThemeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
