import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Plugin para inyectar polyfill de Request de manera más agresiva
const requestPolyfillPlugin = () => {
  return {
    name: 'request-polyfill',
    enforce: 'pre',
    transformIndexHtml(html: string) {
      return html;
    },
    buildStart() {
      // Asegurar que Request esté disponible durante el build
    },
    transform(code: string, id: string) {
      if (code.includes('Request') && (code.includes('destructure') || code.includes('{ Request }'))) {
        const fixedCode = code.replace(
          /const\s*\{\s*Request\s*\}\s*=\s*([^;]+);/g,
          'const Request = (typeof globalThis !== "undefined" && globalThis.Request) || (typeof window !== "undefined" && window.Request) || (typeof self !== "undefined" && self.Request) || (typeof $1 !== "undefined" && $1.Request) || (function(){throw new Error("Request is not available")})();'
        );
        if (fixedCode !== code) {
          return { code: fixedCode, map: null };
        }
      }
      return null;
    },
    renderChunk(code: string, chunk: any) {
      // PRIMERO: Inyectar polyfill AL INICIO del código (antes de cualquier otra cosa)
      const polyfill = '(function(){"use strict";if(typeof fetch!=="undefined"){var R=function(input,init){if(!(this instanceof R))throw new TypeError("Failed to construct Request: Please use the new operator");this.url=typeof input==="string"?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));init=init||{};this.method=(init.method||"GET").toUpperCase();this.headers=new Headers(init.headers||{});this.body=init.body!==undefined?init.body:null;this.mode=init.mode||"cors";this.credentials=init.credentials||"same-origin";this.cache=init.cache||"default";this.redirect=init.redirect||"follow";this.referrer=init.referrer||"about:client";this.integrity=init.integrity||"";};R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};var g=typeof globalThis!=="undefined"?globalThis:(typeof window!=="undefined"?window:(typeof self!=="undefined"?self:typeof global!=="undefined"?global:this));g.Request=R;if(typeof window!=="undefined")window.Request=R;if(typeof self!=="undefined")self.Request=R;if(typeof global!=="undefined")global.Request=R;if(typeof module!=="undefined"&&module.exports)module.exports.Request=R;}})();';
      
      let fixedCode = code;
      let modified = false;
      
      // Inyectar polyfill SIEMPRE primero (solo una vez)
      if (!fixedCode.includes('g.Request=R') && !fixedCode.includes('globalThis.Request')) {
        fixedCode = polyfill + '\n' + fixedCode;
        modified = true;
      }
      
      // SEGUNDO: Interceptar CUALQUIER desestructuración de Request (múltiples patrones)
      const patterns = [
        // Patrón 1: const { Request } = algo
        /(const|let|var)\s*\{\s*Request\s*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        // Patrón 2: const{Request}=algo (sin espacios)
        /(const|let|var)\{\s*Request\s*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        // Patrón 3: {Request}=algo o {Request,otro}=algo
        /\{\s*Request\s*(?:,\s*[^}]+)?\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        // Patrón 4: const{Request}=algo (muy compacto, sin espacios)
        /(const|let|var)\{\s*Request\s*\}=\s*([^;,\n}]+)\s*[;,\n}]/g,
        // Patrón 5: Capturar cualquier intento de desestructurar Request
        /\{\s*Request\s*[^}]*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g
      ];
      
      patterns.forEach(pattern => {
        fixedCode = fixedCode.replace(pattern, (match, keyword, expr) => {
          modified = true;
          // Extraer expresión si no está capturada
          if (!expr) {
            const matchResult = match.match(/=\s*([^;,\n}]+)/);
            expr = matchResult ? matchResult[1].trim() : 'undefined';
          }
          expr = expr ? expr.trim() : 'undefined';
          
          // Si es undefined, void 0, null, o cualquier variación
          if (expr === 'undefined' || expr === 'void 0' || expr === 'void 0' || expr.includes('undefined') || expr === 'null' || expr === 'void(0)') {
            return '(typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:(function Request(){throw new Error("Request is not available");}))));';
          }
          
          // Para cualquier otra expresión, usar try-catch con fallback seguro
          return '(function(){try{var m=' + expr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return (function Request(){throw new Error("Request is not available");});})();';
        });
      });
      
      if (modified) {
        return { code: fixedCode, map: null };
      }
      return null;
    }
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false,
    proxy: {
      '/call-signal': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    minify: false,
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message && (
          warning.message.includes('vitalapi') || 
          warning.message.includes('vitalApi') ||
          warning.message.includes('VitalApi')
        )) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: undefined,
        format: 'es'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      strictRequires: false
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis'
      }
    },
    include: ['@stomp/stompjs', 'sockjs-client', 'simple-peer']
  },
});
