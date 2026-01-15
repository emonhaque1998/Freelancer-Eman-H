import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Increase the warning limit to 1MB as requested by the Vercel/Vite warning
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunking strategy to split vendor libraries into a separate bundle
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});