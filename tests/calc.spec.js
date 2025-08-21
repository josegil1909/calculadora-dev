import { describe, it, expect } from 'vitest';

// Simple import of calculation extracted logic (duplicated minimal) for test demonstration
function compute(form){
  const multipliers = {
    role: { frontend:1, backend:1.05, 'fullstack':1.15, uiux:1.1, pm:1.3 },
    marketLevel: { local:1, nearshore:1.25, 'us-eu':1.6, premium:2.1 },
    experience(years){ if (years < 2) return 0.8; if (years < 4) return 1; if (years < 7) return 1.2; if (years < 11) return 1.4; return 1.6; },
    complexity: { low:1, medium:1.15, high:1.35, 'very-high':1.6 },
    risk: { low:1, medium:1.1, high:1.25 },
    businessValue: { low:1, medium:1.15, high:1.35, critical:1.65 }
  };
  const yearlyCost = form.monthlyCost * 12;
  const productiveYearHours = form.productiveHoursWeek * form.weeksYear;
  const effectiveBillableHours = productiveYearHours * (form.billableUtilization/100);
  if (!effectiveBillableHours) return null;
  const baseHourly = (yearlyCost / effectiveBillableHours) * (1 + form.margin/100);
  const adjustedHourly = baseHourly * multipliers.role[form.role] * multipliers.marketLevel[form.marketLevel] * multipliers.experience(form.years);
  const valueFactors = multipliers.complexity[form.projectComplexity] * multipliers.risk[form.projectRisk] * multipliers.businessValue[form.businessValue];
  const valueHourly = adjustedHourly * valueFactors;
  const projectFactor = 1 + (valueFactors - 1) * 0.35;
  const projectPrice = valueHourly * form.projectHours * projectFactor;
  return { baseHourly, adjustedHourly, valueHourly, projectPrice };
}

describe('calculo tarifas', ()=>{
  it('calcula coherentemente relaciones', ()=>{
    const form = { role:'fullstack', years:5, marketLevel:'local', monthlyCost:3000, productiveHoursWeek:30, weeksYear:46, billableUtilization:70, margin:40, projectHours:100, projectComplexity:'medium', projectRisk:'medium', businessValue:'medium' };
    const r = compute(form);
    expect(r.adjustedHourly).toBeGreaterThan(r.baseHourly);
    expect(r.valueHourly).toBeGreaterThan(r.adjustedHourly);
    expect(r.projectPrice).toBeGreaterThan(r.valueHourly * 10); // 10h subset
  });
});
