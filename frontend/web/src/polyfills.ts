// Polyfills que deben ejecutarse ANTES de cualquier otro código
// Este archivo se importa primero en main.tsx

// Polyfill para Request API si no está disponible
if (typeof window !== 'undefined') {
  // Asegurar que Request esté disponible en globalThis y window
  if (typeof globalThis.Request === 'undefined') {
    // Si fetch está disponible, crear un polyfill básico de Request
    if (typeof fetch !== 'undefined') {
      // Polyfill mínimo de Request
      (globalThis as any).Request = class Request {
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
          } else {
            this.url = input.url;
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

      // También asegurar en window
      (window as any).Request = (globalThis as any).Request;
    } else {
      // Si ni fetch ni Request están disponibles, crear placeholders
      console.warn('Request and fetch are not available. Some features may not work.');
      (globalThis as any).Request = class Request {
        constructor() {
          throw new Error('Request is not supported in this environment');
        }
      };
      (window as any).Request = (globalThis as any).Request;
    }
  }

  // Asegurar que Response también esté disponible
  if (typeof globalThis.Response === 'undefined' && typeof fetch !== 'undefined') {
    (globalThis as any).Response = class Response {
      constructor(public body: any, public init?: ResponseInit) {}
    };
    (window as any).Response = (globalThis as any).Response;
  }
}

