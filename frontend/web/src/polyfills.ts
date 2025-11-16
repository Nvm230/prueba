if (typeof window !== 'undefined') {
  if (typeof globalThis.Request === 'undefined') {
    if (typeof fetch !== 'undefined') {
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

      (window as any).Request = (globalThis as any).Request;
    } else {
      console.warn('Request and fetch are not available. Some features may not work.');
      (globalThis as any).Request = class Request {
        constructor() {
          throw new Error('Request is not supported in this environment');
        }
      };
      (window as any).Request = (globalThis as any).Request;
    }
  }

  if (typeof globalThis.Response === 'undefined' && typeof fetch !== 'undefined') {
    (globalThis as any).Response = class Response {
      constructor(public body: any, public init?: ResponseInit) {}
    };
    (window as any).Response = (globalThis as any).Response;
  }
}

