<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Forja OS — Guía para agentes

PWA para un taller de herrería: catálogo de materiales, optimización de cortes 1D y cotizaciones.

## Stack
- **Next.js 16** (App Router, Turbopack por defecto), **React 19**, **TypeScript** estricto.
- **Tailwind CSS v4** (config CSS-first vía `@import "tailwindcss"` en `src/app/globals.css`, tema con `@theme inline`).
- **Lucide Icons**, **Zustand**, **clsx** + **tailwind-merge**.
- **jsPDF** + **jspdf-autotable** (import **dinámico** para code-splitting): PDF de cotización. Nota: las fuentes estándar de jsPDF (WinAnsi) no incluyen `₡`; usar `CRC` en los PDFs.
- **Supabase** (`@supabase/supabase-js`): fuente de verdad única. Lectura y escritura directa desde los hooks. Realtime via `postgres_changes`. El esquema está en `supabase/migrations/`.
  - Tablas tipadas: `materiales`, `proyectos`, `cotizaciones`, `configuracion` (columnas camelCase entre comillas para coincidir 1:1 con los tipos TypeScript).
  - Sin IndexedDB, sin Dexie, sin outbox, sin sync-engine.
- **PWA**: `src/app/manifest.ts` + `public/sw.js` (solo purga caches viejos, sin estrategia de caché).
  - **NO usar `@ducanh2912/next-pwa`**: es webpack-only e incompatible con Turbopack.

## Comandos
- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — verificación de tipos.

## Convenciones
- Alias de import: `@/*` → `src/*`.
- Todo componente/hook que use Supabase, hooks o estado de UI debe llevar `'use client'`.
- Sin comentarios innecesarios; solo donde aclaren lógica no obvia.
- Naming: componentes `PascalCase`, hooks `useX`, archivos `kebab-case`.
- **Dominio**: moneda CRC (₡, sin decimales); dimensiones en **cm** internamente; precios por **barra de 6 m**; IVA 13% opcional por cotización (default apagado).
- **Persistencia**: todos los hooks (`useMateriales`, `useProyectos`, `useCotizaciones`, `useConfig`) llaman a Supabase directamente — nunca a repositorios locales.
- **Seed automático**: los hooks detectan tabla vacía al primer login e insertan datos por defecto desde `src/data/seed.ts`.

## Estructura (`src/`)
- `app/` — rutas App Router; `manifest.ts` (PWA); `page.tsx` (dashboard).
- `components/ui/` — primitivos; `components/layout/` — AppShell, Header, BottomNav.
- `components/materiales/`, `components/calculadora/`, `components/configuracion/`, `components/cotizaciones/` — por dominio.
- `lib/cutting/` — optimización de cortes (FFD). `lib/pricing/` — motor de cotización.
- `lib/supabase/client.ts` — cliente Supabase singleton (`getSupabase()`).
- `lib/utils/` — `cn`, `id` (uuid), `format` (CRC/medidas, `parseNumero`).
- `types/` — interfaces de dominio. `constants/` — defaults. `data/seed.ts` — catálogo inicial para Supabase.
- `hooks/` — `useMateriales`, `useProyectos`, `useCotizaciones`, `useConfig`, `useSync` (auth). `stores/` — Zustand.

## Reglas de calidad
- **React 19**: no usar `setState` sincrónico dentro de `useEffect` (`react-hooks/set-state-in-effect`). Usar `useState` initializer lazy: `useState(() => Boolean(getSupabase()))`.
- **Mobile-first (toda la app)**: targets táctiles ≥44px (botones de icono `h-11 w-11`), layouts apilados/full-width en móvil, títulos con `break-words` (nunca `truncate`), grids responsivos (`grid-cols-2 sm:grid-cols-N`), un solo badge discreto por tarjeta, acciones primarias (orange) prominentes, tablas con `overflow-x-auto`, y sin `window.location.href` que reemplace la pantalla de la PWA.
- **Documentación**: mantener `README.md` (roadmap de fases) y `AGENTS.md` sincronizados tras cada fase/feature.

## Verificación (criterio de cierre)
- `npm run build`, `npx tsc --noEmit` y `npm run lint` sin errores.
