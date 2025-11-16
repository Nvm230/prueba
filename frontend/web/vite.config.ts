import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

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
    resolveId(source: string) {
      // Interceptar intentos de importar Request de módulos undefined
      if (source === 'Request' || source.includes('Request')) {
        return null; // Dejar que Vite lo resuelva normalmente
      }
      return null;
    },
    renderChunk(code: string, chunk: any) {
      // Inyectar polyfill al inicio de cada chunk principal
      // Esto asegura que Request esté disponible antes de que cualquier código se ejecute
      if (chunk.isEntry || (chunk.fileName && chunk.fileName.includes('index-'))) {
        const polyfill = `(function(){'use strict';
if(typeof fetch!=='undefined'){
  var g=typeof globalThis!=='undefined'?globalThis:(typeof window!=='undefined'?window:(typeof self!=='undefined'?self:typeof global!=='undefined'?global:this));
  if(!g.Request){
    var R=function(input,init){
      if(!(this instanceof R))throw new TypeError('Failed to construct Request: Please use the new operator');
      this.url=typeof input==='string'?input:(input instanceof URL?input.href:(input&&input.url?input.url:String(input)));
      init=init||{};
      this.method=(init.method||'GET').toUpperCase();
      this.headers=new Headers(init.headers||{});
      this.body=init.body!==undefined?init.body:null;
      this.mode=init.mode||'cors';
      this.credentials=init.credentials||'same-origin';
      this.cache=init.cache||'default';
      this.redirect=init.redirect||'follow';
      this.referrer=init.referrer||'about:client';
      this.integrity=init.integrity||'';
    };
    R.prototype.clone=function(){return Object.assign(Object.create(Object.getPrototypeOf(this)),this);};
    g.Request=R;
    if(typeof window!=='undefined'){window.Request=R;try{Object.defineProperty(window,'Request',{value:R,writable:true,configurable:true,enumerable:true});}catch(e){}}
    if(typeof self!=='undefined')self.Request=R;
    if(typeof global!=='undefined')global.Request=R;
    if(typeof module!=='undefined'&&module.exports)module.exports.Request=R;
  }
}
})();
`;
        return { code: polyfill + '\n' + code, map: null };
      }
      return null;
    }
  };
};

export default defineConfig({
  plugins: [requestPolyfillPlugin(), react()],
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
    open: false
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
    include: ['@stomp/stompjs', 'sockjs-client']
  },
});
