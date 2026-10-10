# Forja OS

PWA (Progressive Web App) para la gestión de un taller de herrería, optimizada para tablets y celulares. Los datos viven en Supabase y se leen y escriben en tiempo real; requiere conexión y sesión iniciada.

## Funcionalidades

1. **Catálogo de materiales** — perfiles PTR, tubos, ángulos, platinas, soleras y varillas, con sus costos.
2. **Optimización de cortes 1D** (Cutting Stock Problem) en barras de 6 m, minimizando desperdicio y considerando el kerf.
3. **Multimaterial por proyecto** — un mismo proyecto puede tener planos de corte de varios materiales; al agregarlos a la cotización se consolidan las barras de todos.
4. **Cotizaciones automáticas** — costo de material optimizado + insumos/pintura + mano de obra + % de ganancia + IVA.
5. **Exportación PDF** profesional (vista cliente y taller) con el logo del taller, y compartición por WhatsApp.

## Stack tecnológico

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **Lucide Icons**
- **Supabase** (PostgreSQL + RLS por usuario + Realtime vía `postgres_changes`) como única fuente de datos
- **Vercel** para el despliegue
- **Zustand** para estado de UI
- **jsPDF** + **jspdf-autotable** para exportar cotizaciones a PDF
- **PWA**: `manifest.ts` + `public/sw.js`. El Service Worker solo purga caches antiguos; no hay estrategia de caché ni modo offline.

## Moneda y unidades

- Moneda: **CRC** (colones costarricenses, ₡).
- IVA: **13%** por defecto, activable/desactivable por cotización (por defecto apagado).
- Dimensiones en **cm** (conversión interna); precios por **barra de 6 m**.
- Mano de obra: monto fijo por defecto, con cálculo opcional por horas o porcentaje.

## Estructura de carpetas

```
src/
├── app/             # Rutas App Router + manifest.ts (PWA)
├── components/
│   ├── ui/           # Primitivos (Button, Input, Modal, Card, Table, Badge…)
│   ├── layout/       # AppShell, Header, BottomNav
│   ├── materiales/   # CRUD de materiales
│   ├── calculadora/  # Piezas y visualización de cortes
│   ├── proyectos/    # Lista y detalle de proyectos
│   ├── configuracion/# Cuenta (login), insumos y datos del taller
│   └── cotizaciones/ # Lista y formulario de cotización
├── lib/
│   ├── cutting/     # Algoritmo de corte (First-Fit Decreasing)
│   ├── pricing/     # Motor de cotización
│   ├── pdf/         # Generación PDF (jsPDF + autotable)
│   ├── whatsapp/    # Compartir por WhatsApp (Web Share + wa.me)
│   ├── supabase/    # Cliente Supabase (singleton)
│   └── utils/       # cn, id, format, imagen…
├── types/           # Interfaces de dominio
├── constants/       # Defaults y presets
├── hooks/           # useMateriales, useProyectos, useCotizaciones, useConfig, useSync (solo auth)
├── stores/          # Zustand (estado de UI)
└── data/            # seed.ts: catálogo inicial
supabase/migrations/ # Esquema SQL
```

## Setup local

```bash
npm install
npm run dev        # desarrollo
npm run build      # build de producción
npm run lint       # lint
npx tsc --noEmit   # verificación de tipos
```

## Backend y autenticación (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta `supabase/migrations/0002_direct_tables.sql` en el SQL Editor. Crea las tablas `materiales`, `proyectos`, `cotizaciones` y `configuracion`, con RLS para que cada usuario solo acceda a sus filas (`user_id`). Las columnas están en camelCase entre comillas para coincidir 1:1 con los tipos TypeScript.
3. Configura las variables de entorno (en `.env.local` para desarrollo y en los ajustes del proyecto en Vercel para producción):
   - `NEXT_PUBLIC_SUPABASE_URL` (ej. `https://xxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. En **Configuración → Cuenta**, crea una cuenta (email/contraseña) e inicia sesión.

Al primer login, si las tablas están vacías, los hooks insertan automáticamente los datos por defecto de `src/data/seed.ts`. Todos los hooks leen y escriben directo en Supabase y se actualizan en vivo mediante Realtime.

> `supabase/migrations/0001_init.sql` es la migración histórica (tabla genérica `sync_rows` del esquema offline-first anterior), reemplazada por `0002`. No es necesaria en instalaciones nuevas.

## Roadmap por fases

| Fase | Entregable | Estado |
|------|-----------|--------|
| 1 | Scaffold, PWA, UI base | ✅ |
| 2 | CRUD de materiales | ✅ |
| 3 | Calculadora Cutting Stock 1D + proyectos | ✅ |
| 4 | Motor de cotización + configuración | ✅ |
| 5 | PDF cliente/taller + WhatsApp | ✅ |
| 6 | Refactor a Supabase directo (sin Dexie ni sync-engine) | ✅ |
| 7 | Soporte multimaterial por proyecto y logo del taller | ✅ |
