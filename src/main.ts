import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
import { i18n } from './i18n.ts';
import { router } from './router.ts';
import { prefetchFx } from './lib/fx.ts';

// Early theme application to avoid flash
const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
document.documentElement.classList.toggle('dark', saved === 'dark');

createApp(App).use(i18n).use(router).mount('#app');

// Prefetch FX rates (non-blocking)
prefetchFx();
