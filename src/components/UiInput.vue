<template>
  <input :type="type" v-bind="$attrs" :value="modelValue" :class="classes" @input="onInput" />
</template>
<script setup lang="ts">
import { computed } from 'vue';
interface Props { modelValue: string|number|null|undefined; type?: string; variant?: 'default'|'alt'; size?: 'sm'|'md'; align?: 'left'|'right'|'center' }
const props = withDefaults(defineProps<Props>(), { type:'text', variant:'default', size:'md', align:'left' });
const emit = defineEmits<{ (e:'update:modelValue', v:any):void }>();
function onInput(e:Event){ const el = e.target as HTMLInputElement; let v:any = el.value; if(props.type==='number') v = el.value===''?null:Number(el.value); emit('update:modelValue', v); }
const classes = computed(()=> { const base='ui-input w-full rounded-lg border border-default bg-surface text-app placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'; const alt='bg-surface-alt hover:bg-surface focus:bg-surface'; const sizeMap={ sm:'text-xs px-2 py-1.5', md:'text-sm px-3 py-2' }; const alignMap={ left:'text-left', right:'text-right', center:'text-center' }; return [base, props.variant==='alt'&&alt, sizeMap[props.size], alignMap[props.align]].filter(Boolean).join(' '); });
</script>
