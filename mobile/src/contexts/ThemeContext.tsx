// Enhanced Theme System with Web Color Parity and User Customization
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// Color presets matching web
export const COLOR_PRESETS = {
    purple: {
        name: 'Morado',
        primary: '#9333EA',
        primaryLight: '#a855f7',
        primaryDark: '#7e22ce',
        gradient: ['#7e22ce', '#9333ea', '#a855f7'],
    },
    blue: {
        name: 'Azul',
        primary: '#3b82f6',
        primaryLight: '#60a5fa',
        primaryDark: '#2563eb',
        gradient: ['#2563eb', '#3b82f6', '#60a5fa'],
    },
    green: {
        name: 'Verde',
        primary: '#10b981',
        primaryLight: '#34d399',
        primaryDark: '#059669',
        gradient: ['#059669', '#10b981', '#34d399'],
    },
    pink: {
        name: 'Rosa',
        primary: '#ec4899',
        primaryLight: '#f472b6',
        primaryDark: '#db2777',
        gradient: ['#db2777', '#ec4899', '#f472b6'],
    },
    orange: {
        name: 'Naranja',
        primary: '#f97316',
        primaryLight: '#fb923c',
        primaryDark: '#ea580c',
        gradient: ['#ea580c', '#f97316', '#fb923c'],
    },
    cyan: {
        name: 'Cian',
        primary: '#06b6d4',
        primaryLight: '#22d3ee',
        primaryDark: '#0891b2',
        gradient: ['#0891b2', '#06b6d4', '#22d3ee'],
    },
};

export type ColorPreset = keyof typeof COLOR_PRESETS;
export type ThemeMode = 'light' | 'dark' | 'auto';

interface Theme {
    isDark: boolean;
    mode: ThemeMode;
    colorPreset: ColorPreset;
    colors: {
        // Primary colors (user customizable)
        primary: string;
        primaryLight: string;
        primaryDark: string;
        primaryGradient: string[];

        // Background
        background: string;
        backgroundSecondary: string;
        surface: string;
        surfaceVariant: string;

        // Text
        text: string;
        textSecondary: string;
        textTertiary: string;

        // Borders
        border: string;
        borderLight: string;

        // Status
        success: string;
        warning: string;
        error: string;
        info: string;

        // Glass effect
        glass: {
            light: string;
            medium: string;
            dark: string;
        };

        // Shadows
        shadow: string;
        shadowLight: string;

        // Card
        card: string;
        cardHover: string;
    };
}

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    colorPreset: ColorPreset;
    setMode: (mode: ThemeMode) => void;
    setColorPreset: (preset: ColorPreset) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const createTheme = (isDark: boolean, colorPreset: ColorPreset): Theme => {
    const preset = COLOR_PRESETS[colorPreset];

    return {
        isDark,
        mode: isDark ? 'dark' : 'light',
        colorPreset,
        colors: {
            // Primary (customizable)
            primary: preset.primary,
            primaryLight: preset.primaryLight,
            primaryDark: preset.primaryDark,
            primaryGradient: preset.gradient,

            // Background - matching web dark colors
            background: isDark ? '#020617' : '#f8fafc', // slate-950 for dark
            backgroundSecondary: isDark ? '#0f172a' : '#f1f5f9', // slate-900
            surface: isDark ? '#0f172a' : '#ffffff', // slate-900
            surfaceVariant: isDark ? '#1e293b' : '#f1f5f9', // slate-800

            // Text
            text: isDark ? '#f1f5f9' : '#0f172a',
            textSecondary: isDark ? '#cbd5e1' : '#475569',
            textTertiary: isDark ? '#94a3b8' : '#64748b',

            // Borders
            border: isDark ? '#334155' : '#e2e8f0',
            borderLight: isDark ? '#475569' : '#cbd5e1',

            // Status
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6',

            // Glass
            glass: {
                light: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
                medium: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                dark: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
            },

            // Shadows
            shadow: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
            shadowLight: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',

            // Card
            card: isDark ? '#1e293b' : '#ffffff',
            cardHover: isDark ? '#334155' : '#f8fafc',
        },
    };
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setModeState] = useState<ThemeMode>('auto');
    const [colorPreset, setColorPresetState] = useState<ColorPreset>('purple');
    const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
        Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
    );

    // Load saved preferences
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const savedMode = await AsyncStorage.getItem('theme_mode');
                const savedColor = await AsyncStorage.getItem('color_preset');

                if (savedMode) setModeState(savedMode as ThemeMode);
                if (savedColor) setColorPresetState(savedColor as ColorPreset);
            } catch (error) {
                console.error('Error loading theme preferences:', error);
            }
        };

        loadPreferences();
    }, []);

    // Listen to system theme changes
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
        });

        return () => subscription.remove();
    }, []);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            await AsyncStorage.setItem('theme_mode', newMode);
        } catch (error) {
            console.error('Error saving theme mode:', error);
        }
    };

    const setColorPreset = async (preset: ColorPreset) => {
        setColorPresetState(preset);
        try {
            await AsyncStorage.setItem('color_preset', preset);
        } catch (error) {
            console.error('Error saving color preset:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = mode === 'dark' ? 'light' : mode === 'light' ? 'auto' : 'dark';
        setMode(newMode);
    };

    const isDark = mode === 'auto' ? systemTheme === 'dark' : mode === 'dark';
    const theme = createTheme(isDark, colorPreset);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                mode,
                colorPreset,
                setMode,
                setColorPreset,
                toggleTheme,
            }}
        >
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
