# Herrería App

PWA (Progressive Web App) offline-first para la gestión de un taller de herrería, optimizada para tablets y celulares. Funciona 100% offline tras la primera carga.

## Funcionalidades

1. **Catálogo de materiales** — perfiles PTR, tubos, ángulos, platinas, soleras y varillas, con sus costos.
2. **Optimización de cortes 1D** (Cutting Stock Problem) en barras de 6 m, minimizando desperdicio.
3. **Cotizaciones automáticas** — costo de material optimizado + insumos/pintura + mano de obra + % de ganancia + IVA.
4. **Exportación PDF** profesional (vista cliente y taller) y compartición por WhatsApp.

## Stack tecnológico

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** + **Lucide Icons**
- **Dexie** (IndexedDB) para almacenamiento local offline
- **Zustand** para estado de UI
- **jsPDF** + **jspdf-autotable** para exportar cotizaciones a PDF
- **PWA**: `manifest.ts` + Service Worker propio (`public/sw.js`)
  - Actualización transparente: `skipWaiting` + `clients.claim` + revalidación al enfocar la app (`updateViaCache: 'none'`).

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
│   ├── configuracion/# Insumos y taller
│   └── cotizaciones/ # Lista y formulario de cotización
├── lib/
│   ├── db/          # Dexie + repositorios (patrón Repositorio)
│   ├── cutting/     # Algoritmo de corte (First-Fit Decreasing)
│   ├── pricing/     # Motor de cotización
│   ├── pdf/         # Generación PDF (jsPDF + autotable)
│   ├── whatsapp/    # Compartir por WhatsApp (Web Share + wa.me)
│   ├── sync/        # Sincronización offline-first (outbox + push/pull)
│   ├── supabase/    # Cliente Supabase
│   └── utils/       # cn, id, format
├── types/           # Interfaces de dominio
├── constants/       # Defaults y presets
├── hooks/           # useMateriales, useProyectos, useCotizaciones, useConfig
├── stores/          # Zustand (estado de UI)
└── data/            # Seed del catálogo inicial
```

## Setup local

```bash
npm install
npm run dev        # desarrollo
npm run build      # build de producción
npm run lint       # lint
npx tsc --noEmit   # verificación de tipos
```

## Sincronización multi-dispositivo (Supabase)

La app es offline-first con Dexie como fuente de verdad local. Opcionalmente puedes sincronizar entre dispositivos con Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta la migración `supabase/migrations/0001_init.sql` en el SQL Editor (crea la tabla `sync_rows` + RLS por usuario).
3. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL` (ej. `https://xxx.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. En **Configuración → Sincronización**, crea una cuenta (email/contraseña) e inicia sesión en cada dispositivo con la misma cuenta.

Los cambios se encolan en `syncQueue` (Dexie) y se replican al volver a estar online o con el botón "Sincronizar ahora". Resolución de conflictos: last-write-wins por `actualizadoEn`.

> Nota: en producción, agrega las variables a la configuración del proyecto en Vercel.

## Roadmap por fases

| Fase | Entregable | Estado |
|------|-----------|--------|
| 1 | Scaffold, PWA offline, UI base, capa de datos | ✅ |
| 2 | CRUD de materiales | ✅ |
| 3 | Calculadora Cutting Stock 1D + proyectos | ✅ |
| 4 | Motor de cotización + configuración | ✅ |
| 5 | PDF cliente/taller + WhatsApp | ✅ |
