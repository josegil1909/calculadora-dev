# Calculadora de Tarifas de Desarrollo Web

Aplicación Vue 3 + Vite + TypeScript + Tailwind para estimar tarifas (hora, proyecto, retainer) de servicios de desarrollo web considerando costos, utilización, complejidad, riesgo y valor de negocio.

## Scripts

- `pnpm dev` inicia servidor de desarrollo.
- `pnpm build` construye para producción.
- `pnpm preview` sirve la build.
- `pnpm test` ejecuta tests (Vitest).
- `pnpm typecheck` corre verificación de tipos (vue-tsc).
- `pnpm lint` linting ESLint.
- `pnpm format` aplica Prettier.

## Lógica de Cálculo (Resumen)

1. Costo anual = costo mensual * 12.
2. Horas productivas anuales = horas productivas/semana * semanas trabajadas.
3. Horas facturables efectivas = horas productivas anuales * % utilización.
4. Tarifa base = (costo anual / horas facturables) * (1 + margen).
5. Ajustes por rol, mercado y experiencia multiplicativos.
6. Tarifa estratégica aplica factores de complejidad, riesgo y valor de negocio.
7. Precio de proyecto = horas estimadas × tarifa estratégica × factor de proyecto (suaviza el multiplicador compuesto).
8. Retainer = horas × tarifa estratégica × (1 - descuento volumen).

> Los valores son heurísticos y deben adaptarse al contexto real (industria, país, especialización, demanda, estacionalidad, etc.).

## Funcionalidades Implementadas

- Cálculo de tarifa base, ajustada y estratégica.
- Precio de proyecto y retainer con descuento.
- Multiplicadores editables en UI (rol, mercado, complejidad, riesgo, valor).
- Escenarios guardados (localStorage) + comparación gráfica (Chart.js).
- Exportación CSV y PDF.
- i18n (ES / EN) con textos clave de UI.
- Conversión a múltiples monedas (tipo de cambio manual editable).
- Tema oscuro/claro con persistencia.
- Tests unitarios básicos sobre motor de cálculo.
- Código tipado (TypeScript) y linting/prettier.
- Sistema de tokens de diseño (CSS variables) y utilidades (`bg-app`, `text-app`, `border-default`, `btn-*`).
- Primitivas UI unificadas: `UiButton`, `UiInput`, `UiSelect`, `UiTooltip`.
- Página de guía de estilo / catálogo de componentes (`/guia`).

## Diseño / Tokens

Variables definidas en `src/style.css`:

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--color-bg` | #f8fafc | #020617 | Fondo app |
| `--color-fg` | #0f172a | #e2e8f0 | Texto principal |
| `--color-muted` | #64748b | #94a3b8 | Texto secundario |
| `--color-border` | #cbd5e1 | #1e293b | Bordes |
| `--color-surface` | #ffffff | #0f172a | Tarjetas / paneles |
| `--color-surface-alt` | #f1f5f9 | #162132 | Superficie alternativa |
| `--color-surface-hover` | #f8fafc | #1e293b | Hover superficies |
| `--color-accent` | #2563eb | #3b82f6 | Botones primarios / foco |
| `--color-accent-hover` | #1d4ed8 | #2563eb | Hover primario |
| `--color-danger` | #dc2626 | #f87171 | Acciones destructivas |

Utilidades añadidas:

- `bg-app`, `text-app`, `text-muted`, `border-default`
- `bg-surface`, `bg-surface-alt`, `surface` (wrapper con sombra)
- `btn-primary` (se puede extender con `btn-secondary`, `btn-outline`, `btn-danger`)
- `focus-ring` para accesibilidad.

## Componentización / Primitivas

Primitivas (src/components):

- `UiButton.vue` variantes: `primary | subtle | outline | ghost | danger`; props: `size (xs|sm|md)`, `loading`, `block`.
- `UiInput.vue` props: `type`, `variant (default|alt)`, `align (left|center|right)`; usa `v-model`.
- `UiSelect.vue` similar a input (`variant`, `size`).
- `UiTooltip.vue` prop `text` y slot trigger.
- `AdvancedMultipliers.vue` encapsula multiplicadores avanzados.

Ejemplo:

```vue
<script setup lang="ts">
import UiButton from '@/components/UiButton.vue'
import UiInput from '@/components/UiInput.vue'
import { ref } from 'vue'
const horas = ref(120)
</script>
<template>
<UiInput v-model="horas" type="number" align="right" />
<UiButton variant="primary">Calcular</UiButton>
</template>
```

Guía visual: ruta `/#/guia`.

## Mejoras Futuras Sugeridas

- Fetch dinámico de tipos de cambio (más proveedores / fallback).
- Internacionalización completa de todas las etiquetas restantes.
- Tests adicionales (edge cases, validación de edición de multiplicadores, persistencia de escenarios, componentes UI).
- Ajuste manual de factores de valor/riesgo por intervalo (sliders) y explicación expandible.
- Exportación de informe detallado (PDF multi-página con breakdown).
- PWA / modo offline.

## Uso Rápido

1. Ajusta costos, horas y utilización.
2. Configura rol, mercado y años de experiencia.
3. Ajusta complejidad, riesgo y valor de negocio del proyecto.
4. (Opcional) Modifica multiplicadores avanzados.
5. Guarda escenarios y compáralos.
6. Exporta CSV/PDF para compartir.

## Guía de Estilo Rápida

Tokens principales: ver `src/style.css` (`--color-*`). Utilidades clave: `surface`, `btn-*`, `focus-ring`, `bg-surface-alt`, `text-muted`.

Acceso rápido a la guía: `/#/guia`.

## Licencia

MIT
# calculadora-dev
