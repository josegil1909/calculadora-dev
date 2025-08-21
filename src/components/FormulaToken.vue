<template>
  <span
    class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded border border-blue-500/30 bg-blue-500/5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 cursor-help select-none"
    :title="description || code"
  >
    {<span class="tracking-wide">{{ code }}</span>}
  </span>
</template>
<script setup lang="ts">
interface Props { code: string; description?: string }
const props = defineProps<Props>();
const { code, description } = props;
</script>
<style scoped>
span:hover { background: var(--surface-hover); }
</style>
