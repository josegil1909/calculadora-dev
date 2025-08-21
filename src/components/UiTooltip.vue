<template>
  <div class="relative inline-flex" @mouseenter="onEnter($event)" @mouseleave="onLeave" @mousemove="onMove" @focusin="onEnter()" @focusout="onLeave" ref="triggerRef">
    <slot />
    <transition name="fade">
  <div v-if="isVisible && text" ref="tipRef" :style="styleObj" class="fixed z-50 pointer-events-none max-w-[240px] w-max text-[11px] leading-snug normal-case font-normal rounded-md px-3 py-2 shadow-xl border border-default bg-surface-alt dark:bg-surface-hover text-app selection:bg-blue-500/40">
        <div class="whitespace-pre-wrap break-words">{{ text }}</div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
const props = defineProps<{ text?: string; visible?: boolean }>();
const showInternal = ref(false);
const isVisible = computed(()=> props.visible !== undefined ? props.visible : showInternal.value);
const placement = ref<'pointer'|'right'|'left'|'top'|'bottom'>('pointer');
const styleObj = ref<Record<string,string>>({});
const triggerRef = ref<HTMLElement|null>(null);
const tipRef = ref<HTMLElement|null>(null);

function onEnter(e?:MouseEvent){
  if(e){ lastX = e.clientX; lastY = e.clientY; }
  showInternal.value = true;
}
function onLeave(){ showInternal.value = false; }

let lastX = 0, lastY = 0, rafId:number|undefined;
function computePosition(forceAnchor=false){
  const tip = tipRef.value; if(!tip) return;
  const vw = window.innerWidth; const vh = window.innerHeight;
  const tipRect = tip.getBoundingClientRect();
  let top: number; let left: number;
  const needAnchor = forceAnchor || (lastX===0 && lastY===0);
  if(!needAnchor && placement.value==='pointer'){
    const offset = 14;
    left = lastX + offset;
    top = lastY + 12;
  } else {
    const rect = triggerRef.value?.getBoundingClientRect(); if(!rect) return;
    left = rect.right + 8; top = rect.top + rect.height/2 - tipRect.height/2;
  }
  if(left + tipRect.width > vw - 4) left = vw - tipRect.width - 4;
  if(top + tipRect.height > vh - 4) top = vh - tipRect.height - 4;
  if(left < 4) left = 4; if(top < 4) top = 4;
  styleObj.value = { position:'fixed', top: top+'px', left: left+'px' };
}
function onMove(e:MouseEvent){
  if(!isVisible.value) return; lastX = e.clientX; lastY = e.clientY;
  if(rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(()=> computePosition());
}

function schedulePosition(){ nextTick(()=> { computePosition(); }); }

let resizeObs: any;
function attach(){ window.addEventListener('scroll', schedulePosition, true); window.addEventListener('resize', schedulePosition); }
function detach(){ window.removeEventListener('scroll', schedulePosition, true); window.removeEventListener('resize', schedulePosition); }

watch(isVisible, v=> { if(v){ schedulePosition(); attach(); } else { detach(); } });
onBeforeUnmount(detach);
</script>
<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .12s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
