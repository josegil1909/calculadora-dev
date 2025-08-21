import { createRouter, createWebHashHistory } from 'vue-router';

// Single layout; routes only change visible section inside App.vue
const routes = [
  { path: '/', name: 'calc', component: { template: '<div />' } },
  { path: '/escenarios', name: 'escenarios', component: { template: '<div />' } },
  { path: '/ayuda', name: 'ayuda', component: { template: '<div />' } },
  { path: '/help', redirect: { name: 'ayuda' } },
  { path: '/guia', name: 'guia', component: { template: '<div />' } }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(){ return { top:0 }; }
});
