<template>
  <div class="min-h-screen flex flex-col bg-app text-app transition-colors">
  <header class="sticky top-0 z-30 border-b border-default bg-surface/90 dark:bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/60 transition-colors">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
  <button class="md:hidden text-xl leading-none" @click="mobileMenuOpen=!mobileMenuOpen" :aria-expanded="mobileMenuOpen" aria-label="menu">☰</button>
  <h1 class="text-base font-semibold tracking-wide text-app drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">{{ t('appTitle') }}</h1>
  <nav class="hidden md:flex gap-5 text-[11px] uppercase tracking-wider font-medium" aria-label="primary">
          <button :class="navClass('calc')" @click="go('calc')">{{ t('calculation') }}</button>
          <button :class="navClass('escenarios')" @click="go('escenarios')">{{ t('scenarios') }}</button>
          <button :class="navClass('ayuda')" @click="go('ayuda')">{{ t('help') }}</button>
          <button :class="navClass('guia')" @click="go('guia')">{{ t('styleGuide') }}</button>
        </nav>
  <div class="ml-auto flex items-center gap-2">
          <UiSelect size="sm" variant="alt" :model-value="locale" @update:modelValue="changeLocale">
            <option value="es">🇪🇸 ES</option>
            <option value="en">🇺🇸 EN</option>
          </UiSelect>
          <UiButton size="xs" variant="subtle" :title="'Tema: '+theme" @click="toggleTheme">{{ theme==='dark'?'🌙':'☀️' }}</UiButton>
          <UiButton size="xs" variant="subtle" @click="reset">{{ t('reset') }}</UiButton>
          <ExportActions @csv="exportCSV()" />
        </div>
      </div>
      <!-- Mobile nav dropdown -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-default bg-surface-alt/90 backdrop-blur px-4 pb-3">
        <nav class="flex flex-col gap-2 pt-3 text-[12px] uppercase tracking-wider font-medium" aria-label="mobile primary">
          <button :class="navClass('calc')" @click="go('calc')">{{ t('calculation') }}</button>
          <button :class="navClass('escenarios')" @click="go('escenarios')">{{ t('scenarios') }}</button>
          <button :class="navClass('ayuda')" @click="go('ayuda')">{{ t('help') }}</button>
          <button :class="navClass('guia')" @click="go('guia')">{{ t('styleGuide') }}</button>
        </nav>
      </div>
    </header>

    <main ref="mainEl" class="flex-1 w-full max-w-7xl mx-auto px-4 py-8 grid gap-8 xl:grid-cols-3">
      <!-- Columna de formularios -->
      <section class="space-y-6 xl:col-span-2" v-show="activeTab==='calc'">
        <div class="grid gap-6 md:grid-cols-2">
          <Panel :title="t('profile')" :description="t('descProfile')">
            <Field :label="t('role')" :tooltip="t('tipRole')">
        <UiSelect v-model="form.role">
                <option value="frontend">{{ t('optRoleFrontend') }}</option>
                <option value="backend">{{ t('optRoleBackend') }}</option>
                <option value="fullstack">{{ t('optRoleFullstack') }}</option>
                <option value="uiux">{{ t('optRoleUiux') }}</option>
                <option value="pm">{{ t('optRolePm') }}</option>
        </UiSelect>
            </Field>
            <Field :label="t('experience')" :tooltip="t('tipExperience')">
        <UiInput type="number" min="0" v-model="form.years" />
            </Field>
            <Field :label="t('marketLevel')" :tooltip="t('tipMarketLevel')">
        <UiSelect v-model="form.marketLevel">
                <option value="local">{{ t('optMarketLocal') }}</option>
                <option value="nearshore">{{ t('optMarketNearshore') }}</option>
                <option value="us-eu">{{ t('optMarketUsEu') }}</option>
                <option value="premium">{{ t('optMarketPremium') }}</option>
        </UiSelect>
            </Field>
            <Field :label="t('currency')" :tooltip="t('tipCurrency')">
              <UiSelect v-model="form.currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
                <option value="ARS">ARS</option>
                <option value="VES">VES</option>
              </UiSelect>
            </Field>
            <Field v-if="form.currency==='VES'" :label="t('vesSourceLabel')" :tooltip="t('vesSourceLabel')">
              <UiSelect v-model="form.vesSource">
                <option value="official">{{ t('vesSourceOfficial') }}</option>
                <option value="parallel">{{ t('vesSourceParallel') }}</option>
              </UiSelect>
            </Field>
            <div v-if="form.currency!=='USD'" class="space-y-1">
              <label class="block text-[10px] uppercase tracking-wider text-muted">{{ t('exchangeRate') }}</label>
              <div class="flex gap-2 items-center">
                <UiInput type="number" step="0.0001" min="0" v-model="form.exchangeRate" class="flex-1" />
                <UiButton size="xs" variant="subtle" @click="()=>refreshFx()" :disabled="fxLoading">{{ fxLoading? '…' : t('updateFx') }}</UiButton>
              </div>
              <p v-if="fxError" class="text-[10px] text-red-400" aria-live="polite">{{ fxError }}</p>
              <div v-else class="text-[10px] text-slate-500 leading-tight" aria-live="polite">
                <span>{{ t('fxOneUsd',{ value: formatFx(form.exchangeRate), cur: form.currency }) }}</span><br>
                <span>{{ t('fxInverse',{ value: inverseFx(form.exchangeRate), cur: form.currency }) }}</span>
                <span v-if="fxTimestamp" class="ml-1">• {{ new Date(fxTimestamp).toLocaleTimeString() }}</span>
              </div>
            </div>
          </Panel>
          <Panel :title="t('costs')" :description="t('descCosts')">
            <Field :label="t('monthlyCost')" :tooltip="t('tipMonthlyCost')">
              <UiInput type="number" min="0" v-model="form.monthlyCost" />
            </Field>
            <Field :label="t('productiveHoursWeek')" :tooltip="t('tipProdHours')">
              <UiInput type="number" min="1" max="60" v-model="form.productiveHoursWeek" />
            </Field>
            <Field :label="t('weeksYear')" :tooltip="t('tipWeeksYear')">
              <UiInput type="number" min="10" max="52" v-model="form.weeksYear" />
            </Field>
            <FieldSliderNumber :label="t('billableUtilization')" :tooltip="t('tipUtilization')" v-model="form.billableUtilization" :min="10" :max="95" :marks="[10,50,95]" suffix="%" />
            <FieldSliderNumber :label="t('margin')" :tooltip="t('tipMargin')" v-model="form.margin" :min="0" :max="150" :marks="[0,50,100,150]" suffix="%" />
          </Panel>
          <Panel :title="t('project')" :description="t('descProject')">
            <Field :label="t('projectHours')" :tooltip="t('tipProjectHours')">
              <UiInput type="number" min="1" v-model="form.projectHours" />
            </Field>
            <Field :label="t('complexity')" :tooltip="t('tipComplexity')">
              <UiSelect v-model="form.projectComplexity">
                <option value="low">{{ t('optComplexityLow') }}</option>
                <option value="medium">{{ t('optComplexityMedium') }}</option>
                <option value="high">{{ t('optComplexityHigh') }}</option>
                <option value="very-high">{{ t('optComplexityVeryHigh') }}</option>
              </UiSelect>
            </Field>
            <Field :label="t('risk')" :tooltip="t('tipRisk')">
              <UiSelect v-model="form.projectRisk">
                <option value="low">{{ t('optRiskLow') }}</option>
                <option value="medium">{{ t('optRiskMedium') }}</option>
                <option value="high">{{ t('optRiskHigh') }}</option>
              </UiSelect>
            </Field>
            <Field :label="t('businessValue')" :tooltip="t('tipBusinessValue')">
              <UiSelect v-model="form.businessValue">
                <option value="low">{{ t('optValueLow') }}</option>
                <option value="medium">{{ t('optValueMedium') }}</option>
                <option value="high">{{ t('optValueHigh') }}</option>
                <option value="critical">{{ t('optValueCritical') }}</option>
              </UiSelect>
            </Field>
            <Field :label="t('retainerHours')" :tooltip="t('tipRetainerHours')">
              <UiInput type="number" min="0" v-model="form.retainerHours" />
            </Field>
          </Panel>
          <Panel :title="t('advanced')" :description="t('descAdvanced')" collapsible>
            <AdvancedMultipliers :editable="editableMultipliers" :group-label="groupLabel" :multiplier-label="multiplierLabel" :group-tip="multiplierGroupTip" @apply="applyCustomMultipliers" />
          </Panel>
        </div>
        <details class="mt-4 text-xs">
          <summary class="cursor-pointer text-slate-300">{{ t('method') }}</summary>
          <div class="mt-3 space-y-2 text-[11px] leading-relaxed text-slate-400">
            <p>{{ t('methodBaseLine') }}</p>
            <p>{{ t('methodAdjustedLine') }}</p>
            <p>{{ t('methodStrategicLine') }}</p>
          </div>
        </details>
      </section>

      <!-- Aside resultados y escenarios -->
      <aside class="space-y-6" v-show="activeTab==='calc'">
  <ResultsBoard ref="resultsPanelEl" :cards="cards" :form="form" :computed-values="computedValues" />
  <div class="flex gap-2 -mt-2">
    <UiButton size="xs" variant="subtle" @click="copyResults" :disabled="!computedValues">Copiar JSON</UiButton>
    <UiButton size="xs" variant="subtle" @click="copyMarkdown" :disabled="!computedValues">Copiar MD</UiButton>
  </div>
  <ScenarioSaver :snapshot="localSnapshot" @save="saveScenario" :scenarios="scenarios" @load="loadScenario" @remove="removeScenario" />
      </aside>

      <section v-show="activeTab==='escenarios'" class="xl:col-span-3 space-y-6">
        <ScenarioTable :scenarios="scenarios" @load="loadScenario" @remove="removeScenario" />
        <ChartsComparison :scenarios="scenarios" />
      </section>

      <section v-show="activeTab==='ayuda'" class="xl:col-span-3">
        <HelpSection />
      </section>
      <section v-show="activeTab==='guia'" class="xl:col-span-3">
        <StyleGuide />
      </section>
    </main>

  <footer class="text-[11px] text-muted border-t border-default py-4 text-center relative select-none">
    Vue 3 • Vite • Tailwind — MIT
    <button class="absolute right-2 top-1 text-[10px] text-muted hover:text-app" @click="showDevPanel=!showDevPanel" title="Toggle dev stats">⚙️</button>
    <div v-if="showDevPanel" class="absolute left-2 -top-2 bg-surface-alt/95 border border-default p-2 rounded shadow text-[10px] flex flex-col gap-1 min-w-[110px]">
      <div class="font-semibold">Cache USD</div>
      <div>Hits: {{ cacheHits }}</div>
      <div>Misses: {{ cacheMisses }}</div>
      <div v-if="cacheHits+cacheMisses">Hit Rate: {{ hitRate }}%</div>
  <div><UiButton size="xs" variant="subtle" @click="resetCache">Reset</UiButton></div>
    </div>
  </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
// Removed legacy usePersistentRef (scenarios migrated to composable store)
import Panel from './components/Panel.vue';
import Field from './components/Field.vue';
import ResultsBoard from './components/ResultsBoard.vue';
import AdvancedMultipliers from './components/AdvancedMultipliers.vue';
import ScenarioSaver from './components/ScenarioSaver.vue';
import ScenarioTable from './components/ScenarioTable.vue';
import HelpSection from './components/HelpSection.vue';
import StyleGuide from './components/StyleGuide.vue';
import ChartsComparison from './components/ChartsComparison.vue';
import ExportActions from './components/ExportActions.vue';
import { useI18n } from 'vue-i18n';
import { compute, type Multipliers, type FormState, defaultExchangeRates, type ComputedValues } from './lib/calc';
import { fetchRates, lastFxTimestamp } from './lib/fx';
import { useRoute, useRouter } from 'vue-router';
import UiButton from './components/UiButton.vue';
import UiInput from './components/UiInput.vue';
import UiSelect from './components/UiSelect.vue';
import UiSlider from './components/UiSlider.vue';
import FieldSliderNumber from './components/FieldSliderNumber.vue';
import { useExport } from './composables/useExport';
import { useLabelMaps } from './lib/labels';
import { usePricingForm } from './composables/usePricingForm.ts';
import { useScenarioStore } from './composables/useScenarioStore.ts';

// Pricing form & multipliers encapsulados
const { form, multipliers, editableMultipliers, applyCustomMultipliers, computedValues, cards, defaultState } = usePricingForm();
// Asegurar exchangeRate cuando cambia currency (manteniendo lógica existente)
// Update base exchange rate when currency changes and trigger FX refresh (debounced) if not USD
let fxChangeTimer: number|undefined;
watch(()=>form.currency, cur=> {
  form.exchangeRate = defaultExchangeRates[cur];
  if(cur==='VES' && !form.vesSource) form.vesSource='official';
  if(cur!=='USD'){
    if(fxChangeTimer) clearTimeout(fxChangeTimer);
    fxChangeTimer = window.setTimeout(()=> refreshFx(), 350);
  }
}, { immediate:true });
watch(()=>form.vesSource, ()=> { if(form.currency==='VES') { /* FxRateField se encargará de refrescar */ } });

// Cache USD metrics
const usdCache = new Map<string, ComputedValues|null>();
const cacheHits = ref(0); const cacheMisses = ref(0);
function computeUSD(f:FormState): ComputedValues | null {
  const key = JSON.stringify({
    role:f.role, years:f.years, marketLevel:f.marketLevel,
    monthlyCost:f.monthlyCost, productiveHoursWeek:f.productiveHoursWeek,
    weeksYear:f.weeksYear, billableUtilization:f.billableUtilization,
    margin:f.margin, projectHours:f.projectHours,
    projectComplexity:f.projectComplexity, projectRisk:f.projectRisk,
    businessValue:f.businessValue, retainerHours:f.retainerHours
  });
  if(usdCache.has(key)) { cacheHits.value++; return usdCache.get(key) || null; }
  cacheMisses.value++;
  const copy: FormState = { ...f, exchangeRate: 1, currency: 'USD' } as FormState;
  const res = compute(copy, multipliers);
  usdCache.set(key, res);
  return res;
}

// Scenario store composable
function localSnapshot(){
  const snap = JSON.parse(JSON.stringify({ form }));
  const res = computedValues.value; if(!res) return null;
  const usd = computeUSD(form);
  return { form: snap.form, results: res, resultsUSD: usd || undefined };
}
const { scenarios, saveScenario, loadScenario, removeScenario } = useScenarioStore(localSnapshot, computeUSD);

// Tema
const theme = ref(localStorage.getItem('theme')|| (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'));
function toggleTheme(){
  theme.value = theme.value==='dark'?'light':'dark';
  document.documentElement.classList.toggle('dark', theme.value==='dark');
  localStorage.setItem('theme', theme.value);
}

// Navegación
const route = useRoute();
const rtr = useRouter();
const mobileMenuOpen = ref(false);
const activeTab = ref<'calc'|'escenarios'|'ayuda'|'guia'>( (route.name as any) || 'calc');
watch(()=> route.name, n=> { if(n) { activeTab.value = n as any; mobileMenuOpen.value = false; } });
function go(tab:'calc'|'escenarios'|'ayuda'|'guia'){ if(activeTab.value!==tab) rtr.push({ name: tab }); }
function navClass(tab:string){
  const base = 'transition-colors';
  if(activeTab.value===tab) return base+' text-blue-600 dark:text-blue-400';
  return base+' text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200';
}

// i18n
const { locale, t } = useI18n();
function changeLocale(l:string){ locale.value = l; localStorage.setItem('locale', l); }

// Reset
function reset(){
  Object.assign(form, defaultState());
  // Re-sync exchangeRate with selected currency to avoid stale rate
  form.exchangeRate = defaultExchangeRates[form.currency];
  usdCache.clear();
  cacheHits.value = 0; cacheMisses.value = 0;
}

// Export centralizado
const mainEl = ref<HTMLElement|null>(null);
const { exportCSV } = useExport(computedValues as any, form, cards as any);
function exportFileBase(){ const ts = new Date().toISOString().slice(0,10); return `calculo_${ts}`; }

// FX inline helpers
import { useFx } from './composables/useFx.ts';
const { loading: fxLoading, error: fxError, timestamp: fxTimestamp, refresh: refreshFx } = useFx(form as any);
function formatFx(n:number){ return new Intl.NumberFormat('en-US',{ maximumFractionDigits:4 }).format(n||0); }
function inverseFx(n:number){ if(!n) return ''; return (1/n).toFixed(4); }

const groupHover = ref('');
const { multiplierLabel, groupLabel, multiplierGroupTip } = useLabelMaps();

// Dev: expose cache metrics to console
// Expose cache stats for debugging (always; lightweight)
(window as any).__usdCacheStats = { hits: cacheHits, misses: cacheMisses, map: usdCache };

// Dev panel state & derived metrics
const showDevPanel = ref(false);
const hitRate = computed(()=> {
  const total = cacheHits.value + cacheMisses.value; if(!total) return 0;
  return Math.round((cacheHits.value/total)*100);
});
function resetCache(){ usdCache.clear(); cacheHits.value=0; cacheMisses.value=0; }

// Copy helpers
async function copyResults(){
  if(!computedValues.value) return;
  const payload = { form: { ...form }, results: computedValues.value };
  await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
}
async function copyMarkdown(){
  if(!computedValues.value) return;
  const lines = [
    `# ${t('appTitle')}`,
    `*${new Date().toISOString()}*`,
    '',
    '## Form',
    '```json',
    JSON.stringify({ ...form }, null, 2),
    '```',
    '## Results',
    '| Key | Value |',
    '| --- | ----- |'
  ];
  for(const c of cards.value){
    lines.push(`| ${c.label} | ${c.formatter(computedValues.value as any, form)} |`);
  }
  const md = lines.join('\n');
  await navigator.clipboard.writeText(md);
}
</script>
