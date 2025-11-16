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
    
    // Manejo de errores de autenticación
    if (status === 401) {
      await tokenStorage.remove();
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
    } else {
      message = error.message ?? 'Network error';
    }
    
    return Promise.reject({ ...error, message, status });
  }
);

export default apiClient;
