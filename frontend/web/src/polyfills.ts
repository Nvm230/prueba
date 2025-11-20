// Polyfill para Request y Response - debe ejecutarse ANTES de cualquier otro código
// Este archivo se importa PRIMERO en main.tsx
(function() {
  'use strict';
  
  // Asegurar que globalThis existe
  if (typeof globalThis === 'undefined') {
    if (typeof window !== 'undefined') {
      (window as any).globalThis = window;
    } else if (typeof global !== 'undefined') {
      (global as any).globalThis = global;
    } else if (typeof self !== 'undefined') {
      (self as any).globalThis = self;
    }
  }

  // Polyfill para Request - FORZAR siempre, incluso si existe
  // Algunas dependencias pueden intentar desestructurar Request de módulos undefined
  // Asegurar que Request esté disponible ANTES de que cualquier módulo lo necesite
  if (typeof fetch !== 'undefined') {
    const RequestPolyfill = class Request {
        url: string;
        method: string;
        headers: Headers;
        body: any;
        mode: RequestMode;
        credentials: RequestCredentials;
        cache: RequestCache;
        redirect: RequestRedirect;
        referrer: string;
        integrity: string;

        constructor(input: RequestInfo | URL, init?: RequestInit) {
          if (typeof input === 'string') {
            this.url = input;
          } else if (input instanceof URL) {
            this.url = input.href;
          } else if (input && typeof input === 'object' && 'url' in input) {
            this.url = (input as any).url;
          } else {
            throw new TypeError('Failed to construct \'Request\': Invalid input');
          }

          this.method = (init?.method || 'GET').toUpperCase();
          this.headers = new Headers(init?.headers);
          this.body = init?.body;
          this.mode = init?.mode || 'cors';
          this.credentials = init?.credentials || 'same-origin';
          this.cache = init?.cache || 'default';
          this.redirect = init?.redirect || 'follow';
          this.referrer = init?.referrer || 'about:client';
          this.integrity = init?.integrity || '';
        }

        clone(): Request {
          return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        }
      };

      // FORZAR asignación a todos los contextos posibles - sobrescribir si existe
      (globalThis as any).Request = RequestPolyfill;
      if (typeof window !== 'undefined') {
        (window as any).Request = RequestPolyfill;
        try {
          Object.defineProperty(window, 'Request', {
            value: RequestPolyfill,
            writable: true,
            configurable: true,
            enumerable: true
          });
        } catch (e) {
          // Si falla, al menos asignar directamente
          (window as any).Request = RequestPolyfill;
        }
      }
      if (typeof self !== 'undefined') {
        (self as any).Request = RequestPolyfill;
      }
      if (typeof global !== 'undefined') {
        (global as any).Request = RequestPolyfill;
      }
      
      // También asegurar que esté disponible como exportación de módulo común
      if (typeof module !== 'undefined' && (module as any).exports) {
        ((module as any).exports as any).Request = RequestPolyfill;
      }
    } else {
      console.warn('Request and fetch are not available. Some features may not work.');
      const RequestPolyfill = class Request {
        constructor() {
          throw new Error('Request is not supported in this environment');
        }
      };
      (globalThis as any).Request = RequestPolyfill;
      if (typeof window !== 'undefined') {
        (window as any).Request = RequestPolyfill;
      }
      if (typeof self !== 'undefined') {
        (self as any).Request = RequestPolyfill;
      }
      if (typeof global !== 'undefined') {
        (global as any).Request = RequestPolyfill;
      }
    }

  // Polyfill para Response
  if (typeof globalThis.Response === 'undefined' && typeof fetch !== 'undefined') {
    const ResponsePolyfill = class Response {
      constructor(public body: any, public init?: ResponseInit) {}
    };
    (globalThis as any).Response = ResponsePolyfill;
    if (typeof window !== 'undefined') {
      (window as any).Response = ResponsePolyfill;
    }
    if (typeof self !== 'undefined') {
      (self as any).Response = ResponsePolyfill;
    }
  }

  // Polyfill para process.nextTick (necesario para simple-peer)
  if (typeof process === 'undefined' || !process.nextTick) {
    const processPolyfill = typeof process !== 'undefined' ? process : { env: {}, versions: {} };
    
    if (!processPolyfill.nextTick) {
      processPolyfill.nextTick = function(callback: () => void) {
        if (typeof queueMicrotask !== 'undefined') {
          queueMicrotask(callback);
        } else if (typeof Promise !== 'undefined') {
          Promise.resolve().then(callback);
        } else {
          setTimeout(callback, 0);
        }
      };
    }

    (globalThis as any).process = processPolyfill;
    if (typeof window !== 'undefined') {
      (window as any).process = processPolyfill;
    }
    if (typeof global !== 'undefined') {
      (global as any).process = processPolyfill;
    }
  }
})();

