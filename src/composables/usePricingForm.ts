import { reactive, computed } from 'vue';
import { usePersistentReactive } from './usePersistence.ts';
import { compute, createDefaultForm, defaultMultipliers, type FormState, type Multipliers } from '../lib/calc.ts';
import { formatNumber } from '../lib/format.ts';
import { useI18n } from 'vue-i18n';

export function usePricingForm(){
  const { t } = useI18n();
  function defaultState(): FormState { return { ...createDefaultForm() }; }
  const form = usePersistentReactive<FormState>('formState', ()=> defaultState());
  const multipliers: Multipliers = reactive({
    role: { ...defaultMultipliers.role },
    marketLevel: { ...defaultMultipliers.marketLevel },
    experience: defaultMultipliers.experience,
    complexity: { ...defaultMultipliers.complexity },
    risk: { ...defaultMultipliers.risk },
    businessValue: { ...defaultMultipliers.businessValue }
  }) as Multipliers;
  const editableMultipliers = reactive({
    role: { ...multipliers.role },
    marketLevel: { ...multipliers.marketLevel },
    complexity: { ...multipliers.complexity },
    risk: { ...multipliers.risk },
    businessValue: { ...multipliers.businessValue }
  });
  function applyCustomMultipliers(){
    Object.assign(multipliers.role, editableMultipliers.role);
    Object.assign(multipliers.marketLevel, editableMultipliers.marketLevel);
    Object.assign(multipliers.complexity, editableMultipliers.complexity);
    Object.assign(multipliers.risk, editableMultipliers.risk);
    Object.assign(multipliers.businessValue, editableMultipliers.businessValue);
  }
  function format(n:number){ return formatNumber(n,'es-ES',0); }
  const computedValues = computed(()=> compute(form, multipliers));
  const cards = computed(()=> [
    { key: 'baseHourly', label: t('rateBase'), sub: t('subBase'), formatter: (v:any,f:FormState)=> `${format(v.baseHourly)} ${f.currency}/h` },
    { key: 'adjustedHourly', label: t('rateAdjusted'), sub: t('subAdjusted'), formatter: (v:any,f:FormState)=> `${format(v.adjustedHourly)} ${f.currency}/h` },
    { key: 'valueHourly', label: t('rateStrategic'), sub: t('subStrategic'), formatter: (v:any,f:FormState)=> `${format(v.valueHourly)} ${f.currency}/h` },
    { key: 'projectPrice', label: t('priceProject'), sub: t('subProject'), formatter: (v:any,f:FormState)=> `${format(v.projectPrice)} ${f.currency}` },
    { key: 'retainerPrice', label: t('priceRetainer'), sub: ()=> t('subRetainer',{ hours: form.retainerHours }), formatter: (v:any,f:FormState)=> form.retainerHours>0?`${format(v.retainerPrice)} ${f.currency}`:'—' },
    { key: 'marginPercent', label: t('marginRelative'), sub: t('subMargin'), formatter: (v:any)=> `${v.marginPercent.toFixed(1)}%` },
  ]);
  return { form, multipliers, editableMultipliers, applyCustomMultipliers, computedValues, cards, defaultState };
}
