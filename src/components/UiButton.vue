<template>
  <button :type="type" :disabled="disabled || loading" :class="classes" @click="$emit('click', $event)">
    <span v-if="loading" class="animate-pulse">…</span>
    <slot v-else />
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';
interface Props { variant?: 'primary'|'subtle'|'outline'|'ghost'|'danger'; size?: 'xs'|'sm'|'md'; type?: 'button'|'submit'|'reset'; loading?: boolean; disabled?: boolean; block?: boolean }
const props = withDefaults(defineProps<Props>(), { variant:'subtle', size:'xs', type:'button', loading:false, disabled:false, block:false });
defineEmits<{ (e:'click', ev:MouseEvent):void }>();
const classes = computed(()=> {
  const base = 'ui-btn font-medium rounded-md focus-ring transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-1';
  const sizes: Record<string,string> = { xs:'text-[11px] px-3 py-1', sm:'text-xs px-3 py-1.5', md:'text-sm px-4 py-2' };
  const variants: Record<string,string> = { primary:'btn-primary shadow', subtle:'btn-subtle', outline:'btn-outline', ghost:'btn-ghost', danger:'btn-danger shadow' };
  return [base, sizes[props.size], variants[props.variant], props.block && 'w-full'].filter(Boolean).join(' ');
});
</script>
