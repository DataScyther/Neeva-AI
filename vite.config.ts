import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/** Mirror public env vars into `process.env` for shared modules (no import.meta). */
function publicEnvDefine(mode: string): Record<string, string> {
  const loaded = loadEnv(mode, process.cwd(), ['EXPO_PUBLIC_', 'VITE_']);
  return Object.fromEntries(
    Object.entries(loaded).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
  );
}

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['lucide-react', 'framer-motion', 'tailwind-merge', 'clsx', 'class-variance-authority'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api/nvidia': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (rewritePath) => rewritePath.replace(/^\/api\/nvidia/, ''),
      },
    },
  },
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore'],
    exclude: ['@radix-ui/react-slot'],
  },
  define: {
    global: 'globalThis',
    ...publicEnvDefine(mode),
  },
}));
