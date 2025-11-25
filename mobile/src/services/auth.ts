import api, { tokenManager } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
    id: number;
    name: string;
    email: string;
    profilePictureUrl?: string;
    points?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user?: User;
}

const USER_KEY = 'user_data';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', credentials);
            const { token, refreshToken, user } = response.data;

            // Store tokens securely with SecureStore (via tokenManager)
            await tokenManager.setToken(token);
            if (refreshToken) {
                await tokenManager.setRefreshToken(refreshToken);
            }

            // Store user data in AsyncStorage (non-sensitive)
            if (user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            }

            return response.data;
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', data);
            const { token, refreshToken, user } = response.data;

            // Store tokens securely
            await tokenManager.setToken(token);
            if (refreshToken) {
                await tokenManager.setRefreshToken(refreshToken);
            }

            // Store user data
            if (user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
            }

            return response.data;
        } catch (error: any) {
            console.error('Register error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Error al registrarse');
        }
    },

    async logout(): Promise<void> {
        try {
            // Call logout endpoint if exists
            try {
                await api.post('/auth/logout');
            } catch (error) {
                // Ignore logout endpoint errors
                console.log('Logout endpoint error (ignored):', error);
            }

            // Clear tokens and user data
            await tokenManager.clearTokens();
            await AsyncStorage.removeItem(USER_KEY);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User | null> {
        try {
            const userJson = await AsyncStorage.getItem(USER_KEY);
            if (userJson) {
                return JSON.parse(userJson);
            }
            return null;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await tokenManager.getToken();
        return token !== null;
    },

    async refreshToken(): Promise<string | null> {
        try {
            const refreshToken = await tokenManager.getRefreshToken();
            if (!refreshToken) {
                return null;
            }

            const response = await api.post<AuthResponse>('/auth/refresh', {
                refreshToken,
            });

            const { token, refreshToken: newRefreshToken } = response.data;

            await tokenManager.setToken(token);
            if (newRefreshToken) {
                await tokenManager.setRefreshToken(newRefreshToken);
            }

            return token;
        } catch (error) {
            console.error('Refresh token error:', error);
            await tokenManager.clearTokens();
            return null;
        }
    },
};
