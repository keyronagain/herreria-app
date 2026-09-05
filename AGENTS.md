<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Herrería App — Guía para agentes

PWA offline-first para un taller de herrería: catálogo de materiales, optimización de cortes 1D y cotizaciones.

## Stack
- **Next.js 16** (App Router, Turbopack por defecto), **React 19**, **TypeScript** estricto.
- **Tailwind CSS v4** (config CSS-first vía `@import "tailwindcss"` en `src/app/globals.css`, tema con `@theme inline`).
- **Lucide Icons**, **Dexie** (IndexedDB), **Zustand**, **clsx** + **tailwind-merge**.
- **jsPDF** + **jspdf-autotable** (import **dinámico** para code-splitting): PDF de cotización. Nota: las fuentes estándar de jsPDF (WinAnsi) no incluyen `₡`; usar `CRC` en los PDFs.
- **PWA**: `src/app/manifest.ts` + Service Worker propio en `public/sw.js`.
  - **NO usar `@ducanh2912/next-pwa`**: es webpack-only e incompatible con Turbopack.
  - **Actualización**: el SW usa `skipWaiting` + `clients.claim`; `AppShell` registra con `updateViaCache: 'none'` y revalida en `focus`/`visibilitychange`. Al desplegar cambios en assets cacheados, **incrementar la constante `CACHE`** en `public/sw.js` para purgar caches viejos.

## Comandos
- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción.
- `npm run lint` — ESLint.
- `npx tsc --noEmit` — verificación de tipos.

## Convenciones
- Alias de import: `@/*` → `src/*`.
- Todo componente/hook que toque IndexedDB/Dexie, hooks o estado de UI debe llevar `'use client'`.
- Sin comentarios innecesarios; solo donde aclaren lógica no obvia.
- Naming: componentes `PascalCase`, hooks `useX`, archivos `kebab-case`.
- **Dominio**: moneda CRC (₡, sin decimales); dimensiones en **cm** internamente; precios por **barra de 6 m**; IVA 13% opcional por cotización (default apagado).
- **Persistencia SOLO** vía repositorios en `src/lib/db/repositories/` (patrón Repositorio, listo para sync futuro: UUID, timestamps `creadoEn`/`actualizadoEn`, `syncId` opcional).

## Estructura (`src/`)
- `app/` — rutas App Router; `manifest.ts` (PWA); `page.tsx` (dashboard).
- `components/ui/` — primitivos; `components/layout/` — AppShell, Header, BottomNav.
- `components/materiales/`, `components/calculadora/`, `components/configuracion/`, `components/cotizaciones/` — por dominio.
- `lib/db/` — Dexie (`db.ts`), `base-repository.ts`, repositorios por entidad.
- `lib/cutting/` — optimización de cortes (FFD). `lib/pricing/` — motor de cotización.
- `lib/utils/` — `cn`, `id` (uuid), `format` (CRC/medidas, `parseNumero`).
- `types/` — interfaces de dominio. `constants/` — defaults. `data/seed.ts` — catálogo inicial.
- `hooks/` — `useMateriales`, `useProyectos`, `useCotizaciones`, `useConfig` (usan `dexie-react-hooks`). `stores/` — Zustand.

## Reglas de calidad
- **React 19**: no usar `setState` sincrónico dentro de `useEffect` (`react-hooks/set-state-in-effect`). Preferir suscripciones (`useLiveQuery`) o `useState` initializer con remontaje vía `key`.
- **Documentación**: mantener `README.md` (roadmap de fases) y `AGENTS.md` sincronizados tras cada fase/feature.

## Verificación (criterio de cierre)
- `npm run build`, `npx tsc --noEmit` y `npm run lint` sin errores.
