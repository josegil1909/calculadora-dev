import { Ref } from 'vue';
import type { ComputedValues, FormState } from '../lib/calc.ts';
import { useI18n } from 'vue-i18n';

export interface ExportCard { key:string; label:string; formatter:(v:ComputedValues, f:FormState)=>string }

// Export only CSV now (PDF support removed)
export function useExport(current: Ref<ComputedValues|null>, form: FormState, cards: Ref<ExportCard[]>) {
  function exportCSV(filename?:string){
    if(!current.value) return;
    const { t, locale } = useI18n();
    const ts = new Date().toISOString().slice(0,10);
    const finalName = filename || `tarifas_${ts}.csv`;
    const v = current.value as any;
    const isEs = locale.value === 'es';
    const header = isEs
      ? ['clave','etiqueta','valor_bruto','valor_formateado', form.currency!=='USD' ? 'valor_bruto_usd':'','moneda']
      : ['key','label','raw_value','formatted_value', form.currency!=='USD' ? 'raw_value_usd':'','currency'];
    const currencyValueKeys = new Set(['baseHourly','adjustedHourly','valueHourly','projectPrice','retainerPrice']);

    const metricRows = cards.value.map(c=> {
      const raw = (v as any)[c.key];
      const formatted = c.formatter(current.value as ComputedValues, form);
      const include = c.key==='retainerPrice' && form.retainerHours<=0 ? '' : (typeof raw==='number'? raw: '');
      const usdRaw = form.currency!=='USD' && currencyValueKeys.has(c.key) && typeof raw==='number' ? (raw / (form.exchangeRate||1)) : '';
      return [c.key, c.label, include, formatted, form.currency!=='USD'? usdRaw:'', form.currency];
    });

    // Inputs section
    const inputsLabel = isEs? 'Entradas':'Inputs';
    const metricsLabel = isEs? 'Métricas':'Metrics';
    const metadata: any[] = [
      [isEs?'Aplicación':'App', t('appTitle')],
      [isEs?'Fecha':'Date', new Date().toISOString()],
      [isEs?'Moneda':'Currency', form.currency]
    ];
    const blank: any[] = [];
    const formOrder: (keyof FormState)[] = ['role','years','marketLevel','currency','monthlyCost','productiveHoursWeek','weeksYear','billableUtilization','margin','projectHours','projectComplexity','projectRisk','businessValue','retainerHours','exchangeRate','vesSource'];
    const inputRows = formOrder.filter(k=> k in form).map(k=> [k, (form as any)[k]]);

    const rows: any[] = [];
    rows.push(...metadata);
    rows.push(blank);
    rows.push([metricsLabel]);
    rows.push(header);
    rows.push(...metricRows);
    rows.push(blank);
    rows.push([inputsLabel]);
    rows.push(['key','value']);
    rows.push(...inputRows);

  const csv = rows.map((r: any[])=> r.map((x: unknown)=> '"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\n');
    const withBom = '\uFEFF'+csv; // BOM for Excel UTF-8
    const blob = new Blob([withBom], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=finalName; a.click(); URL.revokeObjectURL(url);
  }

  return { exportCSV };
}
