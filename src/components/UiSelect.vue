<template>
  <div class="relative select-caret">
    <select v-bind="$attrs" :value="modelValue" @change="onChange" :class="classes"><slot /></select>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
interface Props { modelValue: string|number|null|undefined; variant?: 'default'|'alt'; size?: 'sm'|'md' }
const props = withDefaults(defineProps<Props>(), { variant:'default', size:'md' });
const emit = defineEmits<{ (e:'update:modelValue', v:any):void }>();
function onChange(e:Event){ const el = e.target as HTMLSelectElement; emit('update:modelValue', el.value); }
const classes = computed(()=> { const base='ui-select appearance-none w-full rounded-lg border border-default bg-surface text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'; const alt='bg-surface-alt hover:bg-surface focus:bg-surface'; const sizeMap={ sm:'text-xs pl-2 pr-6 py-1.5', md:'text-sm pl-3 pr-7 py-2' }; return [base, props.variant==='alt'&&alt, sizeMap[props.size]].filter(Boolean).join(' '); });
</script>
