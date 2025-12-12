import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      host: true,
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    base: './',
    // build: {
    //   sourcemap: true,
    //   chunkSizeWarningLimit: 1000, // Menigkatkan batas peringatan ke 1000kB (1MB)
    //   rollupOptions: {
    //     output: {
    //       manualChunks(id) {
    //         if (id.includes('node_modules')) {
    //           // Memisahkan library besar ke chunk tersendiri
    //           if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || 
    //             id.includes('recharts')) // <-- PENAMBAHAN PENTING
    //           {
    //             return 'vendor-react';
    //           }
    //           if (id.includes('framer-motion')) {
    //             return 'vendor-framer';
    //           }
    //           if (id.includes('@google/generative-ai')) {
    //             return 'vendor-ai';
    //           }
    //           return 'vendor'; // Sisanya masuk ke vendor.js
    //         }
    //       }
    //     }
    //   }
    // }
  };
});
