import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Plugin para inyectar polyfill de Request de manera más agresiva
const requestPolyfillPlugin = () => {
// VERSION: 20.1 - Patrones ultra agresivos mejorados (10 patrones en renderChunk y generateBundle)
  return {
    name: 'request-polyfill',
    enforce: 'pre',
    transformIndexHtml(html: string) {
      const polyfillScript = `<script>(function(){"use strict";var g=typeof globalThis!=="undefined"?globalThis:(typeof window!=="undefined"?window:(typeof self!=="undefined"?self:typeof global!=="undefined"?global:this));if(typeof globalThis==="undefined")g.globalThis=g;if(typeof fetch!=="undefined"){var R=function(input,init){if(!(this instanceof R))throw new TypeError("Failed to construct Request: Please use the new operator");this.url=typeof input==="string"?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));init=init||{};this.method=(init.method||"GET").toUpperCase();this.headers=new Headers(init.headers||{});this.body=init.body!==undefined?init.body:null;this.mode=init.mode||"cors";this.credentials=init.credentials||"same-origin";this.cache=init.cache||"default";this.redirect=init.redirect||"follow";this.referrer=init.referrer||"about:client";this.integrity=init.integrity||"";};R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};g.Request=R;if(typeof window!=="undefined")window.Request=R;if(typeof self!=="undefined")self.Request=R;if(typeof global!=="undefined")global.Request=R;if(typeof module!=="undefined"&&module.exports)module.exports.Request=R;}})();</script>`;
      if(html.includes("<head>"))html=html.replace("<head>","<head>"+polyfillScript);else if(html.includes("<script"))html=html.replace(/(<script[^>]*>)/,polyfillScript+"$1");else html=polyfillScript+html;
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
      const polyfill = '(function(){"use strict";if(typeof fetch!=="undefined"){var R=function(input,init){if(!(this instanceof R))throw new TypeError("Failed to construct Request: Please use the new operator");this.url=typeof input==="string"?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));init=init||{};this.method=(init.method||"GET").toUpperCase();this.headers=new Headers(init.headers||{});this.body=init.body!==undefined?init.body:null;this.mode=init.mode||"cors";this.credentials=init.credentials||"same-origin";this.cache=init.cache||"default";this.redirect=init.redirect||"follow";this.referrer=init.referrer||"about:client";this.integrity=init.integrity||"";};R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};var g=typeof globalThis!=="undefined"?globalThis:(typeof window!=="undefined"?window:(typeof self!=="undefined"?self:typeof global!=="undefined"?global:this));g.Request=R;if(typeof window!=="undefined")window.Request=R;if(typeof self!=="undefined")self.Request=R;if(typeof global!=="undefined")global.Request=R;if(typeof module!=="undefined"&&module.exports)module.exports.Request=R;}})();';
      
      let fixedCode = code;
      let modified = false;
      
      if (!fixedCode.includes('g.Request=R') && !fixedCode.includes('globalThis.Request')) {
        fixedCode = polyfill + '\n' + fixedCode;
        modified = true;
      }
      
      // PATRÓN ULTRA AGRESIVO: captura código minificado sin espacios
      const ultraPattern = /\{[\s]*Request[\s\w,]*\}[\s]*=[\s]*([^;,\n}]+)/g;
      fixedCode = fixedCode.replace(ultraPattern, (match, expr) => {
        modified = true;
        const trimmedExpr = (expr || '').trim();
        if (!trimmedExpr || trimmedExpr === 'undefined' || trimmedExpr === 'void 0' || trimmedExpr === 'void(0)' || trimmedExpr === 'void0' || trimmedExpr.includes('undefined') || trimmedExpr === 'null') {
          return '(typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:(function Request(){throw new Error("Request is not available");}))))';
        }
        return '(function(){try{var m=' + trimmedExpr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return (function Request(){throw new Error("Request is not available");});})()';
      });
      
      const patterns = [
        /(const|let|var)\s*\{\s*Request\s*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        /(const|let|var)\{\s*Request\s*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        /\{\s*Request\s*(?:,\s*[^}]+)?\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g,
        /(const|let|var)\{\s*Request\s*\}=\s*([^;,\n}]+)\s*[;,\n}]/g,
        /\{\s*Request\s*[^}]*\}\s*=\s*([^;,\n}]+)\s*[;,\n}]/g
      ];
      
      patterns.forEach(pattern => {
        fixedCode = fixedCode.replace(pattern, (match, keyword, expr) => {
          modified = true;
          if (!expr) {
            const matchResult = match.match(/=\s*([^;,\n}]+)/);
            expr = matchResult ? matchResult[1].trim() : 'undefined';
          }
          expr = expr ? expr.trim() : 'undefined';
          
          if (expr === 'undefined' || expr === 'void 0' || expr === 'void 0' || expr.includes('undefined') || expr === 'null' || expr === 'void(0)') {
            return '(typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:(function Request(){throw new Error("Request is not available");}))));';
          }
          
          return '(function(){try{var m=' + expr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return (function Request(){throw new Error("Request is not available");});})();';
        });
      });
      
      if (modified) {
        return { code: fixedCode, map: null };
      }
      return null;
    },
    generateBundle(options: any, bundle: any) {
      const polyfill = '(function(){"use strict";if(typeof fetch!=="undefined"){var R=function(input,init){if(!(this instanceof R))throw new TypeError("Failed to construct Request: Please use the new operator");this.url=typeof input==="string"?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));init=init||{};this.method=(init.method||"GET").toUpperCase();this.headers=new Headers(init.headers||{});this.body=init.body!==undefined?init.body:null;this.mode=init.mode||"cors";this.credentials=init.credentials||"same-origin";this.cache=init.cache||"default";this.redirect=init.redirect||"follow";this.referrer=init.referrer||"about:client";this.integrity=init.integrity||"";};R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};var g=typeof globalThis!=="undefined"?globalThis:(typeof window!=="undefined"?window:(typeof self!=="undefined"?self:typeof global!=="undefined"?global:this));g.Request=R;if(typeof window!=="undefined")window.Request=R;if(typeof self!=="undefined")self.Request=R;if(typeof global!=="undefined")global.Request=R;if(typeof module!=="undefined"&&module.exports)module.exports.Request=R;}})();';
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.code) {
          let code = chunk.code;
          if (!code.includes('g.Request=R') && !code.includes('globalThis.Request')) {
            code = polyfill + '\n' + code;
          }
          const bundleUltraPattern = /\{[\s]*Request[\s\w,]*\}[\s]*=[\s]*([^;,\n}]+)/g;
          code = code.replace(bundleUltraPattern, (match, expr) => {
            const trimmedExpr = (expr || '').trim();
            if (!trimmedExpr || trimmedExpr === 'undefined' || trimmedExpr === 'void 0' || trimmedExpr === 'void(0)' || trimmedExpr === 'void0' || trimmedExpr.includes('undefined') || trimmedExpr === 'null') {
              return '(typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:(function Request(){throw new Error("Request is not available");}))))';
            }
            return '(function(){try{var m=' + trimmedExpr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return (function Request(){throw new Error("Request is not available");});})()';
          });
          const bundleVarPatterns = [/(const|let|var)[\s]*\{[\s]*Request[\s]*\}[\s]*=[\s]*([^;,\n}]+)/g, /(const|let|var)\{[\s]*Request[\s]*\}[\s]*=[\s]*([^;,\n}]+)/g];
          bundleVarPatterns.forEach(pattern => {
            code = code.replace(pattern, (match, keyword, expr) => {
              const trimmedExpr = (expr || '').trim();
              if (!trimmedExpr || trimmedExpr === 'undefined' || trimmedExpr === 'void 0' || trimmedExpr === 'void(0)' || trimmedExpr === 'void0' || trimmedExpr.includes('undefined') || trimmedExpr === 'null') {
                return '(typeof globalThis!=="undefined"&&globalThis.Request?globalThis.Request:(typeof window!=="undefined"&&window.Request?window.Request:(typeof self!=="undefined"&&self.Request?self.Request:(function Request(){throw new Error("Request is not available");}))))';
              }
              return '(function(){try{var m=' + trimmedExpr + ';if(m&&typeof m!=="undefined"&&typeof m.Request!=="undefined")return m.Request;}catch(e){}if(typeof globalThis!=="undefined"&&globalThis.Request)return globalThis.Request;if(typeof window!=="undefined"&&window.Request)return window.Request;if(typeof self!=="undefined"&&self.Request)return self.Request;return (function Request(){throw new Error("Request is not available");});})()';
            });
          });
          chunk.code = code;
        }
      }
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
