import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { tokenStorage } from '@/utils/storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

type ErrorResponse = {
  message?: string;
};

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } else {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json'
    };
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data as ErrorResponse | undefined;
    if (status === 401) {
      await tokenStorage.remove();
    }
    return Promise.reject({ ...error, message: data?.message ?? error.message ?? 'Network error', status });
  }
);

export default apiClient;
