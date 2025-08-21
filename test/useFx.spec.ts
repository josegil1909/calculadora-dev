import { describe, it, expect, vi } from 'vitest';
import { useFx } from '../src/composables/useFx';
import type { FormState } from '../src/lib/calc';

vi.mock('../src/lib/fx.ts', () => ({
  fetchRates: vi.fn(async ()=> ({ USD:1, EUR:0.9, MXN:17, ARS:900, VES:40 })),
  lastFxTimestamp: vi.fn(()=> 1234567890)
}));

describe('useFx', () => {
  it('refresh updates exchangeRate', async () => {
    const form = { currency:'EUR', exchangeRate:0, vesSource:'official' } as FormState;
    const { refresh } = useFx(form);
    await refresh();
    expect(form.exchangeRate).toBe(0.9);
  });
});
