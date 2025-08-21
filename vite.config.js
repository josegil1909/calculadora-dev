import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// Tailwind se maneja vía PostCSS config (postcss.config.js)

export default defineConfig({
  plugins: [vue()],
});
