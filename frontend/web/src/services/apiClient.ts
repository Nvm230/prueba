import axios from 'axios';
import { API_TIMEOUT } from '@/utils/constants';
import { storage, tokenStorageKey } from '@/utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  timeout: API_TIMEOUT
});

type ErrorResponse = {
  message?: string;
};

apiClient.interceptors.request.use((config) => {
  const token = storage.get(tokenStorageKey);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...config.headers
  };
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data as ErrorResponse | undefined;
    if (status === 401) {
      storage.remove(tokenStorageKey);
    }
    const message = data?.message ?? error.message ?? 'Unexpected error';
    return Promise.reject({ ...error, message, status });
  }
);

export const withCancellation = <T>(factory: (signal: AbortSignal) => Promise<T>) => {
  const controller = new AbortController();
  const promise = factory(controller.signal);
  return { promise, cancel: () => controller.abort() };
};

export default apiClient;
