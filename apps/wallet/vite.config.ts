import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/wallet',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(), // Needed for signTypedData
    nodePolyfills({ include: ['cluster'], globals: { global: true } }),
    sentryVitePlugin({
      org: 'luke-rogerson',
      project: 'telegram-wallet',
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  build: {
    sourcemap: true,
  },
});
