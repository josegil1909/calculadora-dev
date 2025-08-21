<template>
  <div class="surface p-4 transition-colors">
    <h3 class="text-sm font-semibold tracking-wide mb-3">{{ t('scenarios') }}</h3>
    <form class="flex gap-2 mb-3" @submit.prevent="onSave">
      <UiInput v-model="name" :placeholder="t('scenarioNamePlaceholder')" />
      <UiButton variant="primary" size="xs" type="submit" :disabled="!name">{{ t('save') }}</UiButton>
    </form>
    <ul class="divide-y divide-default/30 dark:divide-default/40 text-xs max-h-56 overflow-auto">
      <li v-for="s in scenarios" :key="s.id" class="flex items-center justify-between py-2">
        <UiButton variant="ghost" size="xs" class="text-left flex-1 truncate" @click="$emit('load', s.id)">{{ s.name }}</UiButton>
        <div class="flex items-center gap-2">
          <span class="text-muted" v-if="s.data.results">{{ Math.round(s.data.results.valueHourly) }} {{ s.data.form.currency }}/h</span>
          <UiButton variant="ghost" size="xs" class="text-muted hover:text-red-500" @click="$emit('remove', s.id)">✕</UiButton>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
interface Scenario { id:number; name:string; data:any }
const props = defineProps<{ scenarios: Scenario[]; snapshot?: any }>();
const emit = defineEmits<{ (e:'save', name:string):void; (e:'load', id:number):void; (e:'remove', id:number):void }>();
const name = ref('');
const { t } = useI18n();
function onSave(){ emit('save', name.value.trim()); name.value=''; }
</script>
