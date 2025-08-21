declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module './i18n.js' {
  import { I18n } from 'vue-i18n';
  export const i18n: I18n;
}
