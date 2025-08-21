import { describe, it, expect } from 'vitest';
import { createI18n } from 'vue-i18n';
import { useLabelMaps } from '../src/lib/labels';
import { createApp, defineComponent } from 'vue';

const messages = { es: { optRoleFrontend: 'Frontend', role:'Rol', tipGroupRole:'tip role' } };

function withSetup<T>(composable:()=>T){
  let result: T;
  const app = createApp(defineComponent({
    setup(){ result = composable(); return ()=>null; }
  }));
  const i18n = createI18n({ legacy:false, locale:'es', messages });
  app.use(i18n);
  app.mount(document.createElement('div'));
  // @ts-ignore
  return result;
}

describe('labels', () => {
  it('maps option key to translation', () => {
    const { multiplierLabel } = withSetup(()=> useLabelMaps());
    expect(multiplierLabel('role','frontend')).toBe('Frontend');
  });
});
