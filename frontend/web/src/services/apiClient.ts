import axios from 'axios';
import { API_TIMEOUT } from '@/utils/constants';
import { storage, tokenStorageKey } from '@/utils/storage';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Detectar si estamos en producción (AWS) basándose en la URL actual o la variable de entorno
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  // En producción (AWS), si la URL contiene el puerto del frontend (5173), usar URL relativa
  // porque Nginx hace proxy de /api/ al backend
  if (isProduction && envUrl && envUrl !== '' && envUrl.includes('5173')) {
    // Usar URL relativa para que Nginx haga el proxy correctamente
    return '';
  }
  
  // Si estamos en producción pero la URL no contiene 5173, usar URL relativa también
  if (isProduction) {
    return '';
  }
  
  // Si hay una URL configurada y no estamos en producción, usarla
  if (envUrl && envUrl !== '') {
    return envUrl;
  }
  
  // En desarrollo local, usar localhost:8080 como fallback
  return 'http://localhost:8080';
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT
});

// Log para debugging
console.log('[API Client] Base URL:', apiClient.defaults.baseURL);
console.log('[API Client] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('[API Client] Window location:', typeof window !== 'undefined' ? window.location.href : 'N/A');

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
  
  // Detectar si estamos en producción
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
  
  // En producción, siempre usar URL relativa para que Nginx haga el proxy
  // En desarrollo, usar localhost:8080 si no hay baseURL
  if (config.url && config.url.startsWith('/api/')) {
    // Si estamos en producción, forzar URL relativa
    if (isProduction) {
      config.baseURL = '';
    } else {
      // En desarrollo, si no hay baseURL configurada, usar localhost:8080
      if (!config.baseURL) {
        config.baseURL = 'http://localhost:8080';
      }
      // Si la baseURL contiene 5173 (puerto del frontend), usar URL relativa
      if (config.baseURL && config.baseURL.includes('5173')) {
        config.baseURL = '';
      }
    }
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const data = error.response?.data as ErrorResponse | undefined;
    
    // Manejo de errores de autenticación
    if (status === 401) {
      storage.remove(tokenStorageKey);
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    // Mensajes de error amigables según el código de estado
    let message = 'Ocurrió un error inesperado';
    if (data?.message) {
      message = data.message;
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta nuevamente.';
    } else if (error.message === 'Network Error' || !error.response) {
      message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    } else if (status === 400) {
      message = 'Los datos proporcionados no son válidos. Por favor, revisa la información.';
    } else if (status === 403) {
      message = 'No tienes permisos para realizar esta acción.';
    } else if (status === 404) {
      message = 'El recurso solicitado no fue encontrado.';
    } else if (status === 409) {
      message = 'Ya existe un recurso con estos datos.';
    } else if (status === 500) {
      message = 'Error interno del servidor. Por favor, intenta más tarde.';
    } else if (status) {
      message = `Error ${status}: ${error.message || 'Error desconocido'}`;
    }
    
    return Promise.reject({ ...error, message, status });
  }
);

export const withCancellation = <T>(factory: (signal: AbortSignal) => Promise<T>) => {
  const controller = new AbortController();
  const promise = factory(controller.signal);
  return { promise, cancel: () => controller.abort() };
};

export default apiClient;
