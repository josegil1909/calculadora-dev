<template>
  <div class="w-full select-none">
    <div class="flex items-center gap-2 mb-1" v-if="label || showValue">
      <span v-if="label" class="text-[11px] uppercase tracking-wide text-muted font-medium">{{ label }}</span>
      <span v-if="showValue" class="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-alt border border-default/60">{{ modelValue }}{{ suffix }}</span>
    </div>
  <div ref="track" class="relative h-7 flex items-center" @mousedown.prevent="onDown" @touchstart.prevent="onDown">
      <div class="absolute inset-0 rounded-full bg-surface-alt border border-default overflow-hidden">
        <div class="h-full bg-blue-500/40 transition-all" :style="{ width: percent+'%' }"></div>
      </div>
  <div ref="thumb" class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-500 shadow ring-2 ring-white/40 dark:ring-surface-alt cursor-pointer flex items-center justify-center text-[10px] font-semibold text-white focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        :style="{ left: 'calc('+percent+'% - 10px)' }"
        role="slider"
        :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="modelValue" :aria-label="label"
        tabindex="0"
        @keydown.prevent="onKey"
        @mousedown.stop.prevent="onDown" @touchstart.stop.prevent="onDown">
        <span v-if="showThumbValue" class="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white shadow border border-white/20 select-none">{{ modelValue }}{{ suffix }}</span>
      </div>
    </div>
    <div v-if="marks && marks.length" class="mt-1 flex justify-between text-[9px] uppercase tracking-wide text-muted">
      <span v-for="m in marks" :key="m" class="tabular-nums">{{ m }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
interface Props { modelValue: number; min?: number; max?: number; step?: number; label?: string; showValue?: boolean; suffix?: string; marks?: number[]; tooltip?: boolean }
const props = withDefaults(defineProps<Props>(), { min:0, max:100, step:1, showValue:true, suffix:'', marks:()=>[], tooltip:true });
const emit = defineEmits(['update:modelValue','change']);
const percent = computed(()=> ( (props.modelValue - props.min) / (props.max - props.min) ) * 100);
const showThumbValue = ref(false);
let dragging=false;
let trackRect: DOMRect | null = null;
function clamp(v:number){ return Math.min(props.max, Math.max(props.min, v)); }
function snap(v:number){ const s = props.step; return Math.round(v / s) * s; }
function posToValue(clientX:number){
  if(!trackRect) return props.modelValue;
  const ratio = (clientX - trackRect.left) / trackRect.width;
  const raw = props.min + ratio * (props.max - props.min);
  return clamp(snap(raw));
}
function commit(val:number){ emit('update:modelValue', val); emit('change', val); }
function updateFromClientX(clientX:number){ const val = posToValue(clientX); commit(val); }
function onMove(e:MouseEvent|TouchEvent){ if(!dragging) return; const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX; updateFromClientX(clientX); }
function onUp(){ dragging=false; showThumbValue.value=false; trackRect=null; window.removeEventListener('mousemove', onMove as any); window.removeEventListener('touchmove', onMove as any); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchend', onUp); }
const track = ref<HTMLElement|null>(null);
function onDown(e:MouseEvent|TouchEvent){
  dragging=true;
  if(props.tooltip) showThumbValue.value=true;
  trackRect = track.value?.getBoundingClientRect() || thumb.value?.parentElement?.getBoundingClientRect() || null;
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  updateFromClientX(clientX);
  window.addEventListener('mousemove', onMove as any);
  window.addEventListener('touchmove', onMove as any, { passive:false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);
}
function onKey(e:KeyboardEvent){
  let delta = 0;
  if(e.key==='ArrowRight' || e.key==='ArrowUp') delta = props.step;
  else if(e.key==='ArrowLeft' || e.key==='ArrowDown') delta = -props.step;
  else if(e.key==='Home') { emit('update:modelValue', props.min); emit('change', props.min); return; }
  else if(e.key==='End') { emit('update:modelValue', props.max); emit('change', props.max); return; }
  if(delta!==0){
    const next = clamp(snap(props.modelValue + delta));
    emit('update:modelValue', next); emit('change', next);
    if(props.tooltip) { showThumbValue.value=true; setTimeout(()=> showThumbValue.value=false, 1200); }
  }
}
const thumb = ref<HTMLElement|null>(null);
onBeforeUnmount(()=> onUp());
</script>
<style scoped>
/* optional subtle animation */
.transition-all { transition: width .15s ease; }
</style>
