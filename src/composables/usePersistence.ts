import { reactive, ref, watch, type Ref } from 'vue';

export function usePersistentReactive<T extends object>(key: string, factory: () => T): T {
  let parsed: any = null;
  try { const raw = localStorage.getItem(key); if(raw) parsed = JSON.parse(raw); } catch {}
  const state = reactive(parsed || factory()) as T;
  watch(state, v => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, { deep: true });
  return state;
}

export function usePersistentRef<T>(key: string, initial: () => T): Ref<T> {
  let value: T;
  try { const raw = localStorage.getItem(key); value = raw ? JSON.parse(raw) : initial(); } catch { value = initial(); }
  const r = ref<T>(value) as Ref<T>;
  watch(r, v => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, { deep: true });
  return r;
}
