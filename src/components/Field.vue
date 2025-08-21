<template>
  <label class="group flex flex-col gap-1 font-medium text-[11px] tracking-wide uppercase text-app/80 dark:text-app relative">
    <span class="flex items-center gap-2">
      {{ label }}
      <slot name="afterLabel" />
      <UiButton v-if="tooltip" type="button" variant="ghost" size="xs" class="!p-0 w-4 h-4 text-muted hover:text-app" @focus="show=true" @blur="show=false" @mouseenter="show=true" @mouseleave="show=false" aria-label="info">
        <span class="w-4 h-4 rounded-full border border-default flex items-center justify-center text-[10px] leading-none">?</span>
      </UiButton>
    </span>
    <slot />
  <UiTooltip v-if="tooltip" :text="tooltip" :visible="show" />
  <p v-if="hint" class="text-[10px] normal-case font-normal opacity-60 leading-snug text-muted">{{ hint }}</p>
  </label>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import UiButton from './UiButton.vue';
import UiTooltip from './UiTooltip.vue';
interface Props { label: string; hint?: string; tooltip?: string }
defineProps<Props>();
const show = ref(false);
</script>
<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .12s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
