import { describe, it, expect } from 'vitest';
import { createDefaultForm, compute, defaultMultipliers, type Multipliers } from '../src/lib/calc.js';

describe('multipliers customization', () => {
  it('increasing role multiplier raises valueHourly', () => {
    const form = createDefaultForm();
    const base = compute(form, defaultMultipliers)!;
    const custom: Multipliers = { ...defaultMultipliers, role: { ...defaultMultipliers.role, fullstack: defaultMultipliers.role.fullstack * 1.2 } };
    const after = compute(form, custom)!;
    expect(after.valueHourly).toBeGreaterThan(base.valueHourly);
  });

  it('lower utilization increases base hourly (menos horas repartidas)', () => {
    const form1 = createDefaultForm();
    const r1 = compute(form1, defaultMultipliers)!;
    const form2 = { ...form1, billableUtilization: form1.billableUtilization - 20 };
    const r2 = compute(form2, defaultMultipliers)!;
    expect(r2.baseHourly).toBeGreaterThan(r1.baseHourly);
  });
});
