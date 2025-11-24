import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Plugin para inyectar polyfill de Request de manera más agresiva
const requestPolyfillPlugin = () => {
  return {
    name: 'request-polyfill',
    transformIndexHtml(html: string) {
      return html;
    },
    buildStart() {
      // Asegurar que Request esté disponible durante el build
    },
    transform(code: string, id: string) {
      // Interceptar código que intenta desestructurar Request de módulos undefined
      // Patrón: const { Request } = undefinedModule o import { Request } from undefined
      if (code.includes('Request') && (code.includes('destructure') || code.includes('{ Request }'))) {
        // Reemplazar intentos de desestructuración problemáticos
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
      // Interceptar código compilado que intenta desestructurar Request de módulos undefined
      let fixedCode = code;
      let modified = false;
      
      // Patrón más agresivo: capturar CUALQUIER desestructuración de Request
      // Buscar: const { Request } = algo; o const{Request}=algo; o const {Request}=algo;
      // Capturar cualquier expresión después del = (puede ser variable, undefined, expresión compleja, etc)
      const destructurePattern = /(const|let|var)\s*\{\s*Request\s*\}\s*=\s*([^;,\n]+)\s*[;,\n]/g;
      
      // Reemplazar todas las ocurrencias
      fixedCode = fixedCode.replace(destructurePattern, (match, keyword, expr) => {
        modified = true;
        // Limpiar espacios en blanco de la expresión
        expr = expr.trim();
        
        // Si es undefined literal, usar polyfill directo
        if (expr === 'undefined') {
          return keyword + ' Request = (typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:function(){throw new Error("Request is not available");})));';
        }
        
        // Para cualquier otra expresión, envolver en try-catch y usar fallback
        return keyword + ' Request = (function(){try{var m=' + expr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return function(){throw new Error("Request is not available");};})();';
      });
      
      // Inyectar polyfill al inicio de cada chunk principal
      if (chunk.isEntry || (chunk.fileName && chunk.fileName.includes('index-'))) {
        const polyfill = '(function(){"use strict";if(typeof fetch!=="undefined"){var R=function(input,init){if(!(this instanceof R))throw new TypeError("Failed to construct Request: Please use the new operator");this.url=typeof input==="string"?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));init=init||{};this.method=(init.method||"GET").toUpperCase();this.headers=new Headers(init.headers||{});this.body=init.body!==undefined?init.body:null;this.mode=init.mode||"cors";this.credentials=init.credentials||"same-origin";this.cache=init.cache||"default";this.redirect=init.redirect||"follow";this.referrer=init.referrer||"about:client";this.integrity=init.integrity||"";};R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};var g=typeof globalThis!=="undefined"?globalThis:(typeof window!=="undefined"?window:(typeof self!=="undefined"?self:typeof global!=="undefined"?global:this));if(!g.Request){g.Request=R;}if(typeof window!=="undefined"&&!window.Request){window.Request=R;}if(typeof self!=="undefined"&&!self.Request){self.Request=R;}if(typeof global!=="undefined"&&!global.Request){global.Request=R;}if(typeof module!=="undefined"&&module.exports&&!module.exports.Request){module.exports.Request=R;}}})();';
        fixedCode = polyfill + '\n' + fixedCode;
        modified = true;
      }
      
      if (modified) {
        return { code: fixedCode, map: null };
      }
      return null;
    }
  };
};

export default defineConfig({
  plugins: [
    requestPolyfillPlugin(), 
    react(),
    nodePolyfills({
      include: ['stream', 'readable-stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
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
