<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="surface p-6 rounded-xl relative overflow-hidden">
      <div class="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-blue-300/5 rounded-full blur-2xl"></div>
      <h2 class="text-2xl font-bold tracking-tight flex items-center gap-2">
        <span>🧭</span>{{ t('helpTitle') }}
      </h2>
      <p class="mt-2 text-sm text-muted leading-relaxed max-w-2xl">{{ t('helpIntro') }}</p>
      <nav class="mt-4 flex flex-wrap gap-2 text-[12px] font-medium">
        <a href="#pasos" class="px-3 py-1 rounded-full bg-surface-alt hover:bg-surface-hover transition border border-default">{{ t('stepsTitle') }}</a>
        <a href="#tips" class="px-3 py-1 rounded-full bg-surface-alt hover:bg-surface-hover transition border border-default">{{ t('tipsTitle') }}</a>
        <a href="#limites" class="px-3 py-1 rounded-full bg-surface-alt hover:bg-surface-hover transition border border-default">{{ t('limitsTitle') }}</a>
        <a href="#metodo" class="px-3 py-1 rounded-full bg-surface-alt hover:bg-surface-hover transition border border-default">{{ t('method') }}</a>
      </nav>
    </header>

    <!-- Steps -->
    <section id="pasos" class="space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted flex items-center gap-2">
        <span>📌</span>{{ t('stepsTitle') }}
      </h3>
      <ol class="grid sm:grid-cols-2 gap-4 counter-reset steps">
        <li v-for="(s,i) in steps" :key="i" class="surface p-4 rounded-lg relative pl-12 group">
          <div class="absolute left-4 top-4 w-7 h-7 rounded-full bg-surface-alt border border-default flex items-center justify-center text-[12px] font-semibold group-hover:bg-surface-hover transition">{{ i+1 }}</div>
          <p class="text-sm leading-relaxed">{{ s }}</p>
        </li>
      </ol>
    </section>

    <!-- Tips -->
    <section id="tips" class="space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted flex items-center gap-2">
        <span>💡</span>{{ t('tipsTitle') }}
      </h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(tip,i) in tips" :key="i" class="surface p-4 rounded-lg border border-default/60 hover:shadow transition group">
          <div class="flex items-center gap-2 mb-2 text-[12px] font-semibold text-muted uppercase tracking-wide">
            <span class="text-[14px]">⚑</span>
            {{ t('tipsTitle') }} {{ i+1 }}
          </div>
          <p class="text-sm leading-relaxed">{{ tip }}</p>
        </div>
      </div>
    </section>

    <!-- Limits & Method Split -->
    <section id="limites" class="grid md:grid-cols-2 gap-6">
      <div class="surface p-5 rounded-lg space-y-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-muted flex items-center gap-2">
          <span>🛑</span>{{ t('limitsTitle') }}
        </h3>
        <p class="text-sm leading-relaxed">{{ t('limitsText') }}</p>
      </div>
      <div id="metodo" class="surface p-5 rounded-lg space-y-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-muted flex items-center gap-2">
          <span>🧮</span>{{ t('method') }}
        </h3>
        <ul class="text-[13px] leading-relaxed space-y-2 list-disc ml-5">
          <li>{{ t('methodBaseLine') }}</li>
          <li>{{ t('methodAdjustedLine') }}</li>
          <li>{{ t('methodStrategicLine') }}</li>
        </ul>
        <div class="text-[11px] font-mono bg-surface-alt rounded px-3 py-2 border border-default/60 overflow-auto">
          costPlus = (monthlyCost * 12) / (productiveHoursYear * utilization)
          <br />adjusted = costPlus * roleMult * marketMult * experienceMult
          <br />strategic = adjusted * complexityMult * riskMult * valueMult * smoothingFactor
        </div>
      </div>
    </section>

    <!-- Static Formula Explanation -->
    <section id="formula" class="space-y-4">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-muted flex items-center gap-2">
        <span>🧪</span>{{ t('helpFormulaTitle') }}
      </h3>
      <div class="surface p-5 rounded-lg space-y-5 text-sm leading-relaxed">
        <div class="text-[13px] font-sans leading-relaxed space-y-1">
          <div class="font-semibold uppercase tracking-wide text-muted text-[11px] mb-2">{{ t('helpVarsTitle') }}</div>
          <div>{{ t('helpVarMonthly') }}</div>
          <div>{{ t('helpVarProdHours') }}</div>
          <div>{{ t('helpVarWeeks') }}</div>
          <div>{{ t('helpVarUtil') }}</div>
            <div>{{ t('helpVarMargin') }}</div>
          <div>{{ t('helpVarExp') }}</div>
        </div>
        <div class="space-y-1 font-mono text-[13px] bg-surface-alt/60 border border-default/60 rounded p-4 overflow-x-auto">
          <div class="flex gap-2 flex-wrap">
            <span class="px-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{{ t('helpFormulaBaseLabel') }}</span>
            = (
            <span class="px-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">costoMensual</span>
            * 12 )
          </div>
          <div class="pl-6">/ ( <span class="px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">horasProductivasSemana</span> * 46 * ( <span class="px-1 rounded bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 font-semibold">utilizacion</span> / 100 ) )</div>
          <div class="pl-6">* ( 1 + <span class="px-1 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold">margen</span> / 100 )</div>
          <div class="mt-2 flex gap-2 flex-wrap">
            <span class="px-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{{ t('helpFormulaAdjustedLabel') }}</span>
            ≈ <span class="px-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{{ t('helpFormulaBaseLabel') }}</span>
            * <span class="px-1 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">multiplicadorExperiencia</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Callout -->
    <aside class="surface p-4 rounded-lg border border-default/70 flex items-start gap-3 text-sm">
      <div class="text-xl leading-none">📝</div>
      <p class="leading-relaxed"><strong>Nota:</strong> Usa escenarios múltiples y compara visualmente. La herramienta no reemplaza investigación de mercado específica ni análisis fiscal.</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
const { t } = useI18n();

const steps = computed(() => [t('step1'), t('step2'), t('step3'), t('step4')]);
const tips = computed(() => [t('tip1'), t('tip2'), t('tip3'), t('tip4')]);

</script>

<style scoped>
.steps { counter-reset: step; }
</style>
