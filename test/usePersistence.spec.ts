import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { usePersistentRef, usePersistentReactive } from '../src/composables/usePersistence';

// Simple in-memory localStorage mock to ensure persistence across calls
const store: Record<string,string> = {};
// @ts-ignore
global.localStorage = {
  getItem: (k:string)=> store[k] ?? null,
  setItem: (k:string,v:string)=> { store[k]=v; },
  removeItem: (k:string)=> { delete store[k]; },
  clear: ()=> { for(const k in store) delete store[k]; }
};

describe('usePersistence', () => {
  it('persists ref values', async () => {
    const r = usePersistentRef<number>('__test_number', ()=> 1);
    r.value = 42;
    await nextTick();
    const r2 = usePersistentRef<number>('__test_number', ()=> 0);
    expect(r2.value).toBe(42);
  });
  it('persists reactive object', async () => {
    const obj = usePersistentReactive('__test_obj', ()=> ({ a: 1 }));
    // @ts-ignore
    obj.a = 5;
    await nextTick();
    const again = usePersistentReactive('__test_obj', ()=> ({ a: 0 }));
    // @ts-ignore
    expect(again.a).toBe(5);
  });
});
