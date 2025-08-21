<template>
  <div class="space-y-4 text-[11px]">
    <div v-for="(group,key) in editable" :key="key" class="relative rounded-lg p-3 border bg-surface border-default transition-colors">
      <h4 class="flex items-center gap-2 uppercase tracking-wider font-semibold text-app/80 mb-2">
        {{ groupLabel(String(key)) }}
        <UiButton type="button" variant="ghost" size="xs" class="!p-0 w-4 h-4 text-muted hover:text-app" @mouseenter="hover=String(key)" @mouseleave="hover=''" aria-label="info">
          <span class="w-4 h-4 rounded-full border border-default flex items-center justify-center text-[9px] leading-none">?</span>
        </UiButton>
      </h4>
      <div class="grid gap-2 sm:grid-cols-2">
        <div v-for="(val,sub) in group" :key="sub" class="flex items-center gap-2">
          <span class="w-28 truncate text-muted">{{ multiplierLabel(String(key), String(sub)) }}</span>
          <input type="number" step="0.01" v-model.number="editable[String(key)][String(sub)]" class="w-20 bg-surface-alt border border-default text-app rounded px-2 py-1 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
        </div>
      </div>
  <UiTooltip v-if="hover===String(key)" :text="groupTip(String(key))" />
    </div>
  <UiButton type="button" variant="primary" size="xs" @click="apply">{{ t('applyChanges') }}</UiButton>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
interface MultipliersEditable { [k:string]: Record<string, number> }
const props = defineProps<{ editable: MultipliersEditable; groupLabel:(k:string)=>string; multiplierLabel:(g:string,s:string)=>string; groupTip:(k:string)=>string }>();
const emit = defineEmits<{ (e:'apply'):void }>();
const hover = ref('');
const { t } = useI18n();
function apply(){ emit('apply'); }
import UiButton from './UiButton.vue';
import UiTooltip from './UiTooltip.vue';
</script>
<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .12s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
