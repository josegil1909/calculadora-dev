<template>
  <div class="surface p-5 transition-colors">
    <h3 class="text-sm font-semibold tracking-wide mb-4">{{ t('scenariosSaved') }}</h3>
    <div v-if="!scenarios.length" class="text-xs text-muted">{{ t('noScenarios') }}</div>
    <div v-else class="overflow-x-auto">
    <table class="w-full text-[11px] leading-tight align-top">
  <thead class="text-muted uppercase tracking-wider">
        <tr class="text-left">
          <th class="py-2">{{ t('tableName') }}</th>
          <th class="py-2">{{ t('tableValueRate') }}</th>
          <th class="py-2">{{ t('usdPerHour') }}</th>
          <th class="py-2">{{ t('tableProject') }}</th>
          <th class="py-2">{{ t('usdLabel') }}</th>
          <th class="py-2">{{ t('tableRetainer') }}</th>
          <th class="py-2"></th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="s in scenarios" :key="s.id" class="border-t border-default/40 hover:bg-surface-alt dark:hover:bg-surface-hover transition-colors">
          <td class="py-2"><UiButton variant="ghost" size="xs" class="hover:underline !px-1" @click="$emit('load', s.id)">{{ s.name }}</UiButton></td>
          <td class="py-2">{{ format(s.data.results.valueHourly) }} {{ s.data.form.currency }}/h</td>
          <td class="py-2 text-muted">{{ usdValueHourly(s) }}</td>
          <td class="py-2">{{ format(s.data.results.projectPrice) }} {{ s.data.form.currency }}</td>
          <td class="py-2 text-muted">{{ usdProjectPrice(s) }}</td>
          <td class="py-2">
            <span v-if="s.data.form.retainerHours && s.data.form.retainerHours>0">{{ format(s.data.results.retainerPrice) }} {{ s.data.form.currency }}</span>
            <span v-else>{{ t('notApplicable') }}</span>
          </td>
          <td class="py-2 text-right"><UiButton variant="ghost" size="xs" class="text-muted hover:text-red-500 !px-1" @click="$emit('remove', s.id)">✕</UiButton></td>
        </tr>
      </tbody>
  </table>
  </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiButton from './UiButton.vue';
import { formatNumber } from '../lib/format';
interface Scenario { id:number; name:string; data:any }
const props = defineProps<{ scenarios: Scenario[] }>();
function format(n:number){ return formatNumber(n,'es-ES',0); }
const { t } = useI18n();
function usdValueHourly(s:Scenario){
  const usd = s.data.resultsUSD?.valueHourly;
  if(usd) return format(Math.round(usd));
  const rate = s.data.form.exchangeRate||1;
  if(!rate) return '—';
  return format(Math.round(s.data.results.valueHourly / rate));
}
function usdProjectPrice(s:Scenario){
  const usd = s.data.resultsUSD?.projectPrice;
  if(usd) return format(Math.round(usd));
  const rate = s.data.form.exchangeRate||1;
  if(!rate) return '—';
  return format(Math.round(s.data.results.projectPrice / rate));
}
</script>
