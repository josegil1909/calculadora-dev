import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useExport } from '../src/composables/useExport';
import type { ComputedValues, FormState } from '../src/lib/calc';

const dummy: ComputedValues = { baseHourly:10, adjustedHourly:15, valueHourly:20, projectPrice:1000, retainerPrice:500, marginPercent:10 };
const form: FormState = { role:'frontend', years:1, marketLevel:'local', currency:'USD', exchangeRate:1, vesSource:'official', monthlyCost:1000, productiveHoursWeek:30, weeksYear:46, billableUtilization:60, margin:30, projectHours:100, projectComplexity:'low', projectRisk:'low', businessValue:'low', retainerHours:40 } as any;

describe('useExport', () => {
  it('creates CSV blob', () => {
    const current = ref<ComputedValues|null>(dummy);
    const cards = ref([{ key:'baseHourly', label:'Base', formatter:(v:ComputedValues)=> v.baseHourly+' USD/h' }]);
    const { exportCSV } = useExport(current, form, cards as any);
  global.URL.createObjectURL = vi.fn(()=> 'blob:foo');
  // @ts-ignore
  global.URL.revokeObjectURL = vi.fn();
  const anchor = { click: vi.fn(), set href(v:string){}, set download(v:string){} } as any;
  const origCreate = document.createElement;
  // @ts-ignore
  document.createElement = vi.fn((tag:string)=> tag==='a'? anchor : origCreate(tag));
    exportCSV('test.csv');
  expect(anchor.click).toHaveBeenCalled();
  });
});
