import { type Currency, defaultExchangeRates, type FormState } from './calc.js';

// Simple in-memory + localStorage cache
const CACHE_KEY = 'fxRatesCacheV1';
const VES_CACHE_KEY = 'fxVesSourcesV1';
const FX_TTL_MS = 60 * 60 * 1000; // 1h base FX
const VES_TTL_MS = 30 * 60 * 1000; // 30m VES sources
interface CachePayload { timestamp: number; base: string; rates: Record<string, number>; source?: string }
interface VesCache { timestamp: number; sources: Record<string, number> }

function loadCache(): CachePayload | null {
  try { const raw = localStorage.getItem(CACHE_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
}
function saveCache(data: CachePayload){ try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

function loadVesCache(): VesCache | null {
  try { const raw = localStorage.getItem(VES_CACHE_KEY); return raw? JSON.parse(raw): null; } catch { return null; }
}
function saveVesCache(data: VesCache){ try { localStorage.setItem(VES_CACHE_KEY, JSON.stringify(data)); } catch {}
}

// Public free endpoint (no key) – fallback friendly.
const ENDPOINT = 'https://open.er-api.com/v6/latest/';
const DOLAR_API = 'https://ve.dolarapi.com/v1/dolares';

async function fetchDolarApi(): Promise<Record<string, number>|null> {
  try {
    const res = await fetch(DOLAR_API);
    if(!res.ok) return null;
    const json = await res.json();
    if(!Array.isArray(json)) return null;
    const map: Record<string, number> = {};
    for(const item of json){
      if(item && item.fuente && typeof item.promedio === 'number'){
        map[item.fuente] = item.promedio; // fuente: oficial, paralelo, bitcoin
      }
    }
    return map;
  } catch { return null; }
}

export async function fetchRates(base: Currency, form?: Partial<FormState>): Promise<Record<Currency, number>> {
  // We always want USD base semantics for exchangeRate (units of currency per 1 USD).
  // So "base" should normally be 'USD'. For other bases we fall back to deriving relative.
  const now = Date.now();
  let raw: Record<string, number> | null = null;
  if(base === 'USD') {
    const cache = loadCache();
    // Reuse cache (VES inserted separately) if fresh
    if(cache && cache.base==='USD' && (now - cache.timestamp) < FX_TTL_MS) {
      raw = { ...cache.rates };
    } else {
      try {
        const res = await fetch(ENDPOINT + 'USD');
        if(!res.ok) throw new Error('HTTP '+res.status);
        const json = await res.json();
        if(!json || json.result!=='success') throw new Error('API error');
        raw = json.rates;
      } catch {
  raw = { ...defaultExchangeRates };
      }
    }
    // Integrate VES via dolarapi only (no scraping BCV) with its own cache of sources
    let vesSources: Record<string, number> | null = null;
    const vesCache = loadVesCache();
    if(vesCache && (now - vesCache.timestamp) < VES_TTL_MS) {
      vesSources = vesCache.sources;
    } else {
      const api = await fetchDolarApi();
      if(api){ vesSources = api; saveVesCache({ timestamp: now, sources: api }); }
    }
    let ves = defaultExchangeRates.VES; // placeholder fallback
    if(vesSources){
      if(form?.vesSource === 'parallel' && vesSources.paralelo) ves = vesSources.paralelo;
      else if(vesSources.oficial) ves = vesSources.oficial;
    }
    raw!.VES = ves; // units VES per 1 USD (still part of base map)
    // Persist cache (without tying to vesSource; source stored for info)
    saveCache({ timestamp: now, base: 'USD', rates: raw!, source: form?.vesSource });
    return mapToCurrencies('USD', raw!);
  }
  // Non-USD base: derive from defaultExchangeRates only (simplified path)
  const usdRates = defaultExchangeRates; // units currency per 1 USD
  const basePerUSD = usdRates[base];
  const derived: Record<Currency, number> = { ...usdRates } as any;
  Object.keys(usdRates).forEach(k=> { const c = k as Currency; derived[c] = usdRates[c] / basePerUSD; });
  return derived;
}

// Prefetch base USD rates & VES sources (non-blocking usage in main.ts)
export async function prefetchFx(){
  try { await fetchRates('USD', { vesSource: 'official' }); } catch {}
}

export function lastFxTimestamp(): number | null {
  const c = loadCache();
  return c ? c.timestamp : null;
}

function mapToCurrencies(base: Currency, raw: Record<string, number>): Record<Currency, number> {
  const result: Partial<Record<Currency, number>> = {};
  (['USD','EUR','MXN','ARS','VES'] as Currency[]).forEach(c=>{
    if (c === base) result[c] = 1; else if (raw[c]) result[c] = raw[c];
  });
  // Fill missing with fallback defaults if needed
  for (const c of ['USD','EUR','MXN','ARS','VES'] as Currency[]) {
    if (!result[c]) result[c] = defaultExchangeRates[c];
  }
  return result as Record<Currency, number>;
}
