<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
  <div v-for="card in visibleCards" :key="card.key" class="surface relative p-4 transition-colors">
      <div class="flex items-start justify-between">
        <div>
          <p class="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted">
            {{ card.label }}
            <UiButton type="button" variant="ghost" size="xs" class="!p-0 w-4 h-4 text-muted hover:text-app" @mouseenter="show=card.key" @mouseleave="show=''" @focus="show=card.key" @blur="show=''" aria-label="info">
              <span class="w-4 h-4 rounded-full border border-default flex items-center justify-center text-[9px] leading-none">?</span>
            </UiButton>
          </p>
          <p class="text-2xl font-bold tracking-wide mt-1 text-app">
            {{ card.formatter(computedValues, form) }}
          </p>
          <p v-if="form.currency!=='USD' && usdValue(card.key)" class="text-xs font-medium tracking-wide text-muted mt-1">
            {{ t('approxUSD', { value: usdValue(card.key) }) }}
          </p>
          <p class="text-[10px] uppercase tracking-wider text-muted mt-1" v-if="typeof card.sub==='function'">{{ card.sub() }}</p>
          <p class="text-[10px] uppercase tracking-wider text-muted mt-1" v-else>{{ card.sub }}</p>
        </div>
      </div>
  <UiTooltip v-if="show===card.key" :text="tooltipFor(card.key)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import UiButton from './UiButton.vue';
import UiTooltip from './UiTooltip.vue';
import { useI18n } from 'vue-i18n';
interface Card { key:string; label:string; sub:string|(()=>string); formatter:(v:any,f:any)=>string }
interface Props { cards:Card[]; form:any; computedValues:any }
const props = defineProps<Props>();
const { t } = useI18n();
const visibleCards = computed(()=> props.cards.filter(c=> !(c.key==='retainerPrice' && props.form.retainerHours<=0)));
const show = ref('');
function tooltipFor(key:string){
  switch(key){
    case 'baseHourly': return t('tipBaseHourly');
    case 'adjustedHourly': return t('tipAdjustedHourly');
    case 'valueHourly': return t('tipValueHourly');
    case 'projectPrice': return t('tipProjectPrice');
    case 'retainerPrice': return t('tipRetainerPrice');
    case 'marginPercent': return t('tipMarginPercent');
  }
  return '';
}

function usdValue(key:string){
  if(!props.computedValues) return '';
  const rate = props.form.exchangeRate || 1; // units selected currency per 1 USD
  if(!rate) return '';
  // revert value back to USD by dividing by rate when currency != USD
  if(props.form.currency==='USD') return '';
  const map: Record<string, number|undefined> = {
    baseHourly: props.computedValues.baseHourly,
    adjustedHourly: props.computedValues.adjustedHourly,
    valueHourly: props.computedValues.valueHourly,
    projectPrice: props.computedValues.projectPrice,
    retainerPrice: props.computedValues.retainerPrice
  };
  const val = map[key];
  if(val==null) return '';
  const usd = val / rate; // since displayed value already multiplied by rate in compute()
  if(!isFinite(usd)) return '';
  // formatting: show integers for big numbers, 1 decimal for hourly
  let formatted: string;
  if(key.endsWith('Hourly')) formatted = usd.toFixed(2);
  else if(usd >= 1000) formatted = Math.round(usd).toLocaleString('en-US');
  else formatted = usd.toFixed(0);
  return formatted;
}
</script>
<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .12s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
