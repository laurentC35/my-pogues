import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteEnvs } from 'vite-envs';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    federation({
      name: 'app',
      remotes: {
        '@pogues-legacy': {
          type: 'module',
          name: '@pogues-legacy',
          entry: 'http://localhost:5145/remoteEntry.js',
        },
      },
      shared: mode === 'development' ? [] : ['react/', 'react-dom/'],
      runtimePlugins: ['./mfe/plugin.ts'],
    }),
    viteEnvs(),
    react(),
  ],
  build: {
    target: 'esnext',
  },
}));
