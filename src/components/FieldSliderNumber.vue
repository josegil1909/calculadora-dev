<template>
  <Field :label="label" :tooltip="tooltip">
    <div class="space-y-2">
      <UiSlider v-model="inner" :min="min" :max="max" :step="step" :marks="marks" :suffix="suffix" />
      <UiInput type="number" :min="min" :max="max" v-model.number="inner" />
    </div>
  </Field>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Field from './Field.vue';
import UiSlider from './UiSlider.vue';
import UiInput from './UiInput.vue';
interface Props { modelValue: number; label: string; tooltip?: string; min?: number; max?: number; step?: number; marks?: number[]; suffix?: string }
const props = withDefaults(defineProps<Props>(), { min:0, max:100, step:1, marks:()=>[], suffix:'' });
const emit = defineEmits<{ (e:'update:modelValue', v:number):void }>();
const inner = computed({ get:()=> props.modelValue, set:v=> emit('update:modelValue', v) });
</script>
