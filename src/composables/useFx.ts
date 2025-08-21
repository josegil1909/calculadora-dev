import { ref, watch } from 'vue';
import type { FormState } from '../lib/calc.ts';
import { fetchRates, lastFxTimestamp } from '../lib/fx.ts';

export function useFx(form: FormState){
  const loading = ref(false);
  const error = ref<string|null>(null);
  const timestamp = ref<number|null>(lastFxTimestamp());

  async function refresh(base:'USD'='USD'){
    loading.value = true; error.value = null;
    try {
      const rates = await fetchRates(base, form);
      form.exchangeRate = rates[form.currency];
      timestamp.value = Date.now();
    } catch(e:any){ error.value = e.message||'FX error'; }
    finally { loading.value = false; }
  }

  async function autoRefresh(){ try { const rates = await fetchRates('USD', form); form.exchangeRate = rates[form.currency]; } catch {} }

  watch(()=>form.currency, cur=> { if(cur){ autoRefresh(); } });
  watch(()=>form.vesSource, ()=> { if(form.currency==='VES') autoRefresh(); });

  return { loading, error, timestamp, refresh };
}
