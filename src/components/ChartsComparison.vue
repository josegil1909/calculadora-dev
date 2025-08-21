<template>
  <div class="surface p-4 transition-colors flex flex-col">
    <h3 class="text-sm font-semibold tracking-wide mb-3">{{ t('compareHeader') }}</h3>
    <div class="chart-wrapper relative">
      <canvas ref="canvas"></canvas>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-[11px] text-muted animate-pulse bg-surface/40 backdrop-blur-sm">{{ t('loadingChart') }}</div>
      <div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center text-[11px] text-muted">{{ t('emptyChart') }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Chart as ChartType } from 'chart.js';

interface Scenario { id:number; name:string; data:any }
const props = defineProps<{ scenarios: Scenario[] }>();
const canvas = ref<HTMLCanvasElement|null>(null);
let chart: ChartType|undefined;
const loading = ref(true);
const hasData = ref(false);
let ChartLib: any;
const { t } = useI18n();

async function ensureLib(){
  if(ChartLib) return;
  const mod = await import('chart.js');
  ChartLib = mod;
  ChartLib.Chart.register(mod.BarController, mod.BarElement, mod.CategoryScale, mod.LinearScale, mod.Tooltip, mod.Legend);
}

async function build(){
  if(!canvas.value){ loading.value=false; return; }
  await ensureLib();
  const ctx = canvas.value.getContext('2d');
  if(!ctx) return;
  const labels = props.scenarios.map(s=> s.name);
  const valueHourly = props.scenarios.map(s=> Math.round((s.data.resultsUSD?.valueHourly ?? s.data.results?.valueHourly) || 0));
  const projectPrice = props.scenarios.map(s=> Math.round((s.data.resultsUSD?.projectPrice ?? s.data.results?.projectPrice) || 0));
  hasData.value = props.scenarios.length > 0;
  if(!hasData.value){ loading.value = false; return; }
  chart = new ChartLib.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: t('rateStrategic')+' (h)', data: valueHourly, backgroundColor: 'rgba(59,130,246,0.65)', yAxisID:'yRate' },
        { label: t('priceProject'), data: projectPrice, backgroundColor: 'rgba(16,185,129,0.55)', yAxisID:'yProj' }
      ]
    },
    options: { 
      responsive: true, maintainAspectRatio:false, animation:false,
    layout:{ padding:{ top:0, right:4, bottom:4, left:4 } },
      interaction:{ mode:'index', intersect:false },
      scales:{ 
        x:{ ticks:{ color:'#94a3b8'} },
  yRate:{ position:'left', beginAtZero:true, ticks:{ color:'#3b82f6' }, title:{ display:true, text:t('rateStrategic')+' (USD/h)', color:'#3b82f6', font:{ size:11 } } },
  yProj:{ position:'right', beginAtZero:true, grid:{ drawOnChartArea:false }, ticks:{ color:'#10b981' }, title:{ display:true, text:t('priceProject')+' (USD)', color:'#10b981', font:{ size:11 } } }
      },
  plugins:{ legend:{ labels:{ color:'#64748b', font:{ size:11 } } }, tooltip:{ callbacks:{ label(ctx: any){ const v = ctx.parsed.y; const ds = ctx.dataset.label||''; return ds+': '+ new Intl.NumberFormat('es-ES').format(v); } } } }
    }
  });
  loading.value = false;
}

function update(){
  if(!chart){ build(); return; }
  chart.data.labels = props.scenarios.map(s=> s.name);
  const valueHourly = props.scenarios.map(s=> Math.round((s.data.resultsUSD?.valueHourly ?? s.data.results?.valueHourly) || 0));
  const projectPrice = props.scenarios.map(s=> Math.round((s.data.resultsUSD?.projectPrice ?? s.data.results?.projectPrice) || 0));
  hasData.value = props.scenarios.length > 0;
  if(!hasData.value){ if(chart){ chart.destroy(); chart=undefined; } loading.value=false; return; }
  chart.data.datasets[0].data = valueHourly;
  chart.data.datasets[1].data = projectPrice;
  chart.update('none');
}

onMounted(build);
// Watch only a compact signature to avoid deep reactive churn
watch(() => props.scenarios.map(s=> [s.id, s.name, Math.round(s.data.results?.valueHourly||0), Math.round(s.data.results?.projectPrice||0)]), update, { deep:false });
onBeforeUnmount(()=> { if(chart){ chart.destroy(); chart = undefined; } });
</script>
<style scoped>
.chart-wrapper{height:210px; overflow:hidden;}
@media (min-width:640px){ .chart-wrapper{height:230px;} }
@media (min-width:1024px){ .chart-wrapper{height:250px;} }
.chart-wrapper canvas{width:100%!important; height:100%!important; display:block;}
</style>
