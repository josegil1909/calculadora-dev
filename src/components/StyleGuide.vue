<template>
  <div class="space-y-10">
    <header class="surface p-5">
      <h2 class="text-xl font-bold tracking-wide mb-1">{{ t('styleGuideTitle') }}</h2>
      <p class="text-sm text-muted">Design tokens, tipografía y componentes reutilizables.</p>
    </header>

    <!-- Typography -->
    <section class="surface p-5 space-y-4">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">{{ t('typographyHeading') }}</h3>
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">H1 / .text-3xl font-bold</h1>
          <code class="block mt-1 text-[11px] bg-surface-alt px-2 py-1 rounded">&lt;h1 class=&quot;text-3xl font-bold tracking-tight&quot;&gt;...&lt;/h1&gt;</code>
        </div>
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">H2 / .text-2xl font-semibold</h2>
          <code class="block mt-1 text-[11px] bg-surface-alt px-2 py-1 rounded">&lt;h2 class=&quot;text-2xl font-semibold tracking-tight&quot;&gt;...&lt;/h2&gt;</code>
        </div>
        <div>
          <h3 class="text-xl font-semibold">H3 / .text-xl font-semibold</h3>
          <code class="block mt-1 text-[11px] bg-surface-alt px-2 py-1 rounded">&lt;h3 class=&quot;text-xl font-semibold&quot;&gt;...&lt;/h3&gt;</code>
        </div>
        <div>
          <p class="text-sm leading-relaxed">Body Small / .text-sm leading-relaxed</p>
          <code class="block mt-1 text-[11px] bg-surface-alt px-2 py-1 rounded">&lt;p class=&quot;text-sm leading-relaxed&quot;&gt;...&lt;/p&gt;</code>
        </div>
        <div>
          <p class="text-[11px] uppercase tracking-wider text-muted">Meta / .text-[11px] uppercase tracking-wider text-muted</p>
          <code class="block mt-1 text-[11px] bg-surface-alt px-2 py-1 rounded">&lt;p class=&quot;text-[11px] uppercase tracking-wider text-muted&quot;&gt;...&lt;/p&gt;</code>
        </div>
      </div>
    </section>

    <!-- Buttons -->
    <section class="surface p-5 space-y-4">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">{{ t('componentsHeading') }}: Buttons</h3>
      <div class="flex flex-wrap gap-3 items-center">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton variant="subtle">Subtle</UiButton>
        <UiButton variant="outline">Outline</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton variant="danger">Danger</UiButton>
        <UiButton variant="primary" loading>Loading</UiButton>
        <UiButton variant="primary" disabled>Disabled</UiButton>
      </div>
      <pre class="text-[11px] bg-surface-alt p-3 rounded overflow-auto"><code>&lt;UiButton variant="primary"&gt;Primary&lt;/UiButton&gt;
&lt;UiButton variant="subtle"&gt;Subtle&lt;/UiButton&gt;
&lt;UiButton variant="outline"&gt;Outline&lt;/UiButton&gt;
&lt;UiButton variant="ghost"&gt;Ghost&lt;/UiButton&gt;
&lt;UiButton variant="danger"&gt;Danger&lt;/UiButton&gt;</code></pre>
    </section>

    <!-- Inputs & Selects -->
    <section class="surface p-5 space-y-4">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">{{ t('componentsHeading') }}: Inputs</h3>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <UiInput v-model="demoInput1" placeholder="Default input" />
          <UiInput v-model="demoInput2" variant="alt" placeholder="Alt input" />
          <UiInput v-model="demoNumber" type="number" align="right" />
        </div>
        <div class="space-y-2">
          <UiSelect v-model="demoSelect">
            <option value="A">Opción A</option>
            <option value="B">Opción B</option>
          </UiSelect>
          <UiSelect v-model="demoSelectAlt" variant="alt">
            <option value="AltA">Alt A</option>
            <option value="AltB">Alt B</option>
          </UiSelect>
        </div>
      </div>
      <pre class="text-[11px] bg-surface-alt p-3 rounded overflow-auto"><code>&lt;UiInput v-model=&quot;value&quot; placeholder=&quot;...&quot; /&gt;
&lt;UiInput v-model=&quot;value&quot; variant=&quot;alt&quot; /&gt;
&lt;UiSelect v-model=&quot;selectValue&quot;&gt;...&lt;/UiSelect&gt;</code></pre>
    </section>

    <!-- Tooltip -->
    <section class="surface p-5 space-y-4">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">{{ t('componentsHeading') }}: Tooltip</h3>
      <div>
        <UiTooltip text="Esto es un tooltip de ejemplo">
          <UiButton variant="outline">Hover / focus</UiButton>
        </UiTooltip>
      </div>
      <pre class="text-[11px] bg-surface-alt p-3 rounded overflow-auto"><code>&lt;UiTooltip text=&quot;Texto&quot;&gt;
  &lt;UiButton&gt;Trigger&lt;/UiButton&gt;
&lt;/UiTooltip&gt;</code></pre>
    </section>

    <!-- Tokens Preview -->
    <section class="surface p-5 space-y-4">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">Tokens</h3>
      <div class="grid sm:grid-cols-3 md:grid-cols-4 gap-3 text-[11px]">
        <div class="p-3 rounded border border-default bg-app">bg-app</div>
        <div class="p-3 rounded border border-default bg-surface">bg-surface</div>
        <div class="p-3 rounded border border-default bg-surface-alt">bg-surface-alt</div>
        <div class="p-3 rounded border border-default bg-surface-hover">bg-surface-hover</div>
        <div class="p-3 rounded border border-default btn-primary">btn-primary</div>
        <div class="p-3 rounded border border-default btn-subtle">btn-subtle</div>
        <div class="p-3 rounded border border-default btn-outline">btn-outline</div>
        <div class="p-3 rounded border border-default btn-ghost">btn-ghost</div>
        <div class="p-3 rounded border border-default btn-danger">btn-danger</div>
      </div>
    </section>

    <!-- Usage Notes -->
    <section class="surface p-5 space-y-3">
      <h3 class="text-sm font-semibold tracking-wide uppercase text-muted">{{ t('usageHeading') }}</h3>
      <ul class="list-disc ml-5 text-[13px] leading-relaxed">
        <li>Usa <code>&lt;UiButton variant="primary" /&gt;</code> para acciones principales.</li>
        <li><code>subtle</code> para acciones secundarias dentro de paneles.</li>
        <li><code>outline</code> para acciones neutrales donde el fondo debe transparentar.</li>
        <li><code>ghost</code> para iconos o enlaces discretos.</li>
        <li><code>danger</code> para acciones destructivas (eliminar escenario).</li>
        <li>Respetar tamaños: <code>xs</code> navegación / toolbars, <code>sm</code> formularios densos, <code>md</code> diálogos.</li>
      </ul>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
import UiSelect from './UiSelect.vue';
import UiTooltip from './UiTooltip.vue';
const { t } = useI18n();

const demoInput1 = ref('');
const demoInput2 = ref('');
const demoNumber = ref(123);
const demoSelect = ref('A');
const demoSelectAlt = ref('AltA');
</script>
