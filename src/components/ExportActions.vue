<template>
  <div class="flex items-center gap-2">
    <UiButton size="xs" variant="subtle" @click="$emit('csv')">{{ t('csv') }}</UiButton>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UiButton from './UiButton.vue';
const { t } = useI18n();
defineEmits<{ (e:'csv'):void }>();
</script>
