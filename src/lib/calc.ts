// Core pricing calculation logic with TypeScript types.
// All monetary values are computed in a base currency (USD) and then optionally converted
// using an exchange rate (selected currency units per 1 USD).

export type Role = 'frontend' | 'backend' | 'fullstack' | 'uiux' | 'pm';
export type MarketLevel = 'local' | 'nearshore' | 'us-eu' | 'premium';
export type Complexity = 'low' | 'medium' | 'high' | 'very-high';
export type RiskLevel = 'low' | 'medium' | 'high';
export type BusinessValue = 'low' | 'medium' | 'high' | 'critical';
export type Currency = 'USD' | 'EUR' | 'MXN' | 'ARS' | 'VES';

export interface FormState {
  role: Role;
  years: number;
  marketLevel: MarketLevel;
  currency: Currency;
  monthlyCost: number; // base living + overhead cost (USD equivalent)
  productiveHoursWeek: number;
  weeksYear: number;
  billableUtilization: number; // %
  margin: number; // % desired margin
  projectHours: number;
  projectComplexity: Complexity;
  projectRisk: RiskLevel;
  businessValue: BusinessValue;
  retainerHours: number;
  exchangeRate: number; // selected currency units per 1 USD (e.g. 0.92 for EUR)
  vesSource?: 'official' | 'parallel';
}

export interface ComputedValues {
  baseHourly: number;
  adjustedHourly: number;
  valueHourly: number;
  projectPrice: number;
  retainerPrice: number;
  marginPercent: number;
}

export interface Multipliers {
  role: Record<Role, number>;
  marketLevel: Record<MarketLevel, number>;
  experience: (years: number) => number;
  complexity: Record<Complexity, number>;
  risk: Record<RiskLevel, number>;
  businessValue: Record<BusinessValue, number>;
}

export const defaultMultipliers: Multipliers = {
  role: { frontend: 1, backend: 1.05, fullstack: 1.15, uiux: 1.1, pm: 1.3 },
  marketLevel: { local: 1, nearshore: 1.25, 'us-eu': 1.6, premium: 2.1 },
  experience(years) {
    if (years < 2) return 0.8;
    if (years < 4) return 1;
    if (years < 7) return 1.2;
    if (years < 11) return 1.4;
    return 1.6;
  },
  complexity: { low: 1, medium: 1.15, high: 1.35, 'very-high': 1.6 },
  risk: { low: 1, medium: 1.1, high: 1.25 },
  businessValue: { low: 1, medium: 1.15, high: 1.35, critical: 1.65 }
};

export const defaultExchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92, // example spot approximation
  MXN: 16.8,
  ARS: 950, // placeholder – real rate volatile
  VES: 136.8931 // placeholder; real fetched from BCV
};

export function compute(form: FormState, multipliers: Multipliers): ComputedValues | null {
  const yearlyCostUSD = form.monthlyCost * 12; // assume monthlyCost already in USD base
  const productiveYearHours = form.productiveHoursWeek * form.weeksYear;
  const effectiveBillableHours = productiveYearHours * (form.billableUtilization / 100);
  if (!effectiveBillableHours) return null;
  const baseHourly = (yearlyCostUSD / effectiveBillableHours) * (1 + form.margin / 100);
  const adjustedHourly =
    baseHourly *
    multipliers.role[form.role] *
    multipliers.marketLevel[form.marketLevel] *
    multipliers.experience(form.years);
  const valueFactors =
    multipliers.complexity[form.projectComplexity] *
    multipliers.risk[form.projectRisk] *
    multipliers.businessValue[form.businessValue];
  const valueHourly = adjustedHourly * valueFactors;
  const projectFactor = 1 + (valueFactors - 1) * 0.35;
  const projectPrice = valueHourly * form.projectHours * projectFactor;
  let retainerPrice = 0;
  if (form.retainerHours > 0) {
    const retainerBase = valueHourly * form.retainerHours;
    retainerPrice = retainerBase * (1 - 0.12);
  }
  const marginPercent = ((valueHourly - baseHourly) / baseHourly) * 100;

  const rate = form.exchangeRate || 1; // selected currency units per 1 USD
  return {
    baseHourly: baseHourly * rate,
    adjustedHourly: adjustedHourly * rate,
    valueHourly: valueHourly * rate,
    projectPrice: projectPrice * rate,
    retainerPrice: retainerPrice * rate,
    marginPercent
  };
}

export function createDefaultForm(): FormState {
  return {
    role: 'fullstack',
    years: 5,
    marketLevel: 'local',
    currency: 'USD',
    monthlyCost: 3000,
    productiveHoursWeek: 30,
    weeksYear: 46,
    billableUtilization: 70,
    margin: 40,
    projectHours: 120,
    projectComplexity: 'medium',
    projectRisk: 'medium',
    businessValue: 'medium',
    retainerHours: 20,
    exchangeRate: 1,
    vesSource: 'official'
  };
}

export function cloneDeep<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }
