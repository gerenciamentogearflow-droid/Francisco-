import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Francisco App',
          short_name: 'FranciscoApp',
          description: 'Sistema de Emissão de Certificados para Oficina',
          theme_color: '#dc2626',
          background_color: '#0a0a0a',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE0LjcgNi4zYSExIDEgMCAwIDAgNS41IDIuNGEyLjEgMi4xIDAgMCAxIDIuMiAydjZhMi4xIDIuMSAwIDAgMS0yLjIgMmExIDEgMCAwIDAtNS41IDIuNGEyLjEgMi4xIDAgMCAxLTIuMiAydjZhMi4xIDIuMSAwIDAgMS0yLjItMiAxIDEgMCAwIDAtNS41LTIuNGEyLjEgMi4xIDAgMCAxLTIuMi0ydjZhMi4xIDIuMSAwIDAgMSAyLjItMmExIDEgMCAwIDAgNS41LTIuNGEyLjEgMi4xIDAgMCAxIDIuMi0yWiIvPjwvc3ZnPg==',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE0LjcgNi4zYSExIDEgMCAwIDAgNS41IDIuNGEyLjEgMi4xIDAgMCAxIDIuMiAydjZhMi4xIDIuMSAwIDAgMS0yLjIgMmExIDEgMCAwIDAtNS41IDIuNGEyLjEgMi4xIDAgMCAxLTIuMiAydjZhMi4xIDIuMSAwIDAgMS0yLjItMiAxIDEgMCAwIDAtNS41LTIuNGEyLjEgMi4xIDAgMCAxLTIuMi0ydjZhMi4xIDIuMSAwIDAgMSAyLjItMmExIDEgMCAwIDAgNS41LTIuNGEyLjEgMi4xIDAgMCAxIDIuMi0yWiIvPjwvc3ZnPg==',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
