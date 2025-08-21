import { describe, it, expect } from 'vitest';
import { createDefaultForm, compute, defaultMultipliers } from '../src/lib/calc.js';

describe('calc module', () => {
  it('produces stable ordering base < adjusted < value', () => {
    const form = createDefaultForm();
    const r = compute(form, defaultMultipliers)!;
    expect(r.adjustedHourly).toBeGreaterThan(r.baseHourly);
    expect(r.valueHourly).toBeGreaterThan(r.adjustedHourly);
  });

  it('applies exchange rate for currency conversion', () => {
    const form = createDefaultForm();
    form.exchangeRate = 2; // pretend currency 2 units per USD
    const r = compute(form, defaultMultipliers)!;
    const form2 = createDefaultForm();
    form2.exchangeRate = 1; // USD baseline
    const r2 = compute(form2, defaultMultipliers)!;
    expect(r.baseHourly).toBeCloseTo(r2.baseHourly * 2, 5);
  });
});
