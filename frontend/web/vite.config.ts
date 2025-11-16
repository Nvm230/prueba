import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
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
      target: 'es2020'
    }
  }
});
