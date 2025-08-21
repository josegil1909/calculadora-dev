<template>
  <div class="surface p-5 relative" :class="{ 'overflow-hidden': collapsible }">
    <header class="mb-4 flex items-start gap-3">
      <div class="flex-1">
  <h3 class="text-sm font-semibold tracking-wide flex items-center gap-2 text-app">
          <slot name="icon" />
          {{ title }}
        </h3>
  <p v-if="description" class="text-[11px] text-muted mt-1 leading-snug">{{ description }}</p>
      </div>
  <UiButton v-if="collapsible" size="xs" variant="ghost" @click="open=!open">{{ open? 'Ocultar':'Mostrar' }}</UiButton>
    </header>
    <div v-show="!collapsible || open" class="space-y-3">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import UiButton from './UiButton.vue';
interface Props { title: string; description?: string; collapsible?: boolean }
const props = defineProps<Props>();
const open = ref(!props.collapsible);
</script>
