<template>
  <Field :label="t('exchangeRate')" :tooltip="t('tipExchangeRate')">
    <div class="flex flex-col gap-1">
      <div class="flex gap-2 items-center">
        <UiInput type="number" step="0.0001" min="0" v-model="model.exchangeRate" class="flex-1" :placeholder="placeholderRate" />
        <UiButton size="xs" variant="subtle" @click="()=>refresh()" :disabled="loading">{{ loading? '…' : t('updateFx') }}</UiButton>
      </div>
      <div v-if="model.exchangeRate && model.exchangeRate>0 && model.currency!=='USD'" class="flex flex-col text-[10px] leading-tight text-slate-500">
        <span>{{ t('fxOneUsd',{ value: format(model.exchangeRate), cur: model.currency }) }}</span>
        <span>{{ t('fxInverse',{ value: inverseFormatted, cur: model.currency }) }}</span>
      </div>
      <p v-if="error" class="text-[10px] text-red-400" aria-live="polite">{{ error }}</p>
      <p v-else-if="timestamp" class="text-[10px] text-slate-500" aria-live="polite">{{ new Date(timestamp).toLocaleTimeString() }}</p>
    </div>
  </Field>
</template>
<script setup lang="ts">
import Field from './Field.vue';
import UiInput from './UiInput.vue';
import UiButton from './UiButton.vue';
import type { FormState } from '../lib/calc.ts';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useFx } from '../composables/useFx.ts';
const props = defineProps<{ model: FormState }>();
const { t } = useI18n();
const { loading, error, timestamp, refresh } = useFx(props.model);
function format(n:number){ return new Intl.NumberFormat('en-US',{ maximumFractionDigits:4 }).format(n); }
const inverseFormatted = computed(()=> props.model.exchangeRate? (1/props.model.exchangeRate).toFixed(4):'');
const placeholderRate = computed(()=> props.model.currency==='USD'? '1.0000':'');
</script>
