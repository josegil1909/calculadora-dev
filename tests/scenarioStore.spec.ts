import { describe, it, expect } from 'vitest';
import { useScenarioStore } from '../src/composables/useScenarioStore.ts';
import { compute, createDefaultForm, defaultMultipliers, type FormState } from '../src/lib/calc.ts';

function mockComputeUSD(f:FormState){
  const copy = { ...f, exchangeRate:1, currency:'USD' } as FormState;
  return compute(copy, defaultMultipliers as any);
}

describe('useScenarioStore', ()=> {
  it('saves and loads scenario with USD results', ()=> {
  const form = createDefaultForm();
  const res = compute(form, defaultMultipliers as any)!;
  const usd = mockComputeUSD(form)!;
  const snapshot = ()=> ({ form, results: res, resultsUSD: usd });
    const { scenarios, saveScenario, loadScenario } = useScenarioStore(snapshot, mockComputeUSD as any);
    saveScenario('Test');
    expect(scenarios.value.length).toBe(1);
    const loaded = loadScenario(scenarios.value[0].id);
    expect(loaded?.data.resultsUSD).toBeTruthy();
  });
});
