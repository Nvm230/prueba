import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    university?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        photoUrl?: string;
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post('/auth/login', credentials);
        console.log('[AUTH] Login response:', response.data);

        const { token, user } = response.data;

        if (token) {
            await AsyncStorage.setItem('authToken', token);
            console.log('[AUTH] Token saved');
        }

        if (user) {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            console.log('[AUTH] User saved:', user);
        } else {
            console.warn('[AUTH] No user object in response, will fetch user info');
            // Si no viene el user, intentar obtenerlo del backend
            try {
                const userResponse = await apiClient.get('/users/me');
                if (userResponse.data) {
                    await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));
                    console.log('[AUTH] User fetched and saved:', userResponse.data);
                }
            } catch (error) {
                console.error('[AUTH] Failed to fetch user info:', error);
            }
        }

        return response.data;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post('/auth/register', data);
        console.log('[AUTH] Register response:', response.data);

        const { token, user } = response.data;

        if (token) {
            await AsyncStorage.setItem('authToken', token);
            console.log('[AUTH] Token saved');
        }

        if (user) {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            console.log('[AUTH] User saved:', user);
        } else {
            console.warn('[AUTH] No user object in response, will fetch user info');
            try {
                const userResponse = await apiClient.get('/users/me');
                if (userResponse.data) {
                    await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));
                    console.log('[AUTH] User fetched and saved:', userResponse.data);
                }
            } catch (error) {
                console.error('[AUTH] Failed to fetch user info:', error);
            }
        }

        return response.data;
    },

    async logout(): Promise<void> {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
    },

    async getCurrentUser() {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('authToken');
        return token !== null && token !== undefined;
    },
};
