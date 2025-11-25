import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    clearTokens(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const retryableStatuses = [408, 429, 500, 502, 503, 504];

// Request interceptor - Add auth token and AbortController
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add AbortController for request cancellation
        if (!config.signal) {
            const controller = new AbortController();
            config.signal = controller.signal;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors, refresh token, and retry logic
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
            _retryCount?: number;
        };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenManager.getRefreshToken();

            if (!refreshToken) {
                tokenManager.clearTokens();
                window.location.href = '/login';
                processQueue(error, null);
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { token: newToken, refreshToken: newRefreshToken } = response.data;

                tokenManager.setToken(newToken);
                if (newRefreshToken) {
                    tokenManager.setRefreshToken(newRefreshToken);
                }

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                processQueue(null, newToken);
                isRefreshing = false;

                return api(originalRequest);
            } catch (refreshError) {
                tokenManager.clearTokens();
                window.location.href = '/login';
                processQueue(error, null);
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        // Retry logic for retryable errors
        if (
            error.response &&
            retryableStatuses.includes(error.response.status) &&
            (!originalRequest._retryCount || originalRequest._retryCount < MAX_RETRIES)
        ) {
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            // Exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
            await sleep(delay);

            console.log(
                `Retrying request (${originalRequest._retryCount}/${MAX_RETRIES})...`
            );

            return api(originalRequest);
        }

        // Handle other errors
        if (error.response) {
            const status = error.response.status;
            const message = (error.response.data as any)?.message || error.message;

            switch (status) {
                case 400:
                    console.error('Bad Request:', message);
                    break;
                case 403:
                    console.error('Forbidden:', message);
                    break;
                case 404:
                    console.error('Not Found:', message);
                    break;
                case 409:
                    console.error('Conflict:', message);
                    break;
                case 500:
                    console.error('Server Error:', message);
                    break;
                default:
                    console.error('Error:', message);
            }
        } else if (error.request) {
            console.error('Network Error: No response from server');
        } else {
            console.error('Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
