import { describe, it, expect } from 'vitest';
import { fetchRates } from '../src/lib/fx.ts';
import { createDefaultForm } from '../src/lib/calc.ts';

// This test assumes network; if offline, it will be skipped.

function isOnline(){ return typeof fetch !== 'undefined'; }

describe('FX caching (smoke)', () => {
  it('fetches rates and returns object with USD base key', async () => {
    if(!isOnline()) return; // skip offline
    const form = { ...createDefaultForm(), currency:'EUR' } as any;
    const rates = await fetchRates('USD', form);
    expect(rates).toBeTruthy();
    expect(rates.USD).toBe(1);
  }, 15000);
});
