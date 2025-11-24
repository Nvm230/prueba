/**
 * Retry logic para errores recuperables
 */
export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryableStatuses?: number[];
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'Network Error']
};

/**
 * Determina si un error es recuperable y debe reintentarse
 */
const isRetryable = (error: any, options: Required<RetryOptions>): boolean => {
  // Errores de red/timeout
  if (error.code && options.retryableErrors.includes(error.code)) {
    return true;
  }
  
  // Errores de red sin código
  if (error.message === 'Network Error' && !error.response) {
    return true;
  }
  
  // Códigos de estado HTTP recuperables
  if (error.status && options.retryableStatuses.includes(error.status)) {
    return true;
  }
  
  return false;
};

/**
 * Espera un tiempo antes de reintentar
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Ejecuta una función con lógica de reintento
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // No reintentar si es el último intento o el error no es recuperable
      if (attempt === opts.maxRetries || !isRetryable(error, opts)) {
        throw error;
      }
      
      // Esperar antes de reintentar (exponential backoff)
      const delayMs = opts.retryDelay * Math.pow(2, attempt);
      await delay(delayMs);
    }
  }
  
  throw lastError;
};



