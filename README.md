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
- **PWA**: `manifest.ts` + Service Worker propio (`public/sw.js`)

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
│   ├── ui/          # Primitivos (Button, Input, Modal, Card, Table, Badge…)
│   └── layout/      # AppShell, Header, BottomNav
├── lib/
│   ├── db/          # Dexie + repositorios (patrón Repositorio)
│   ├── cutting/     # Algoritmo de corte (Fase 3)
│   ├── pricing/     # Motor de cotización (Fase 4)
│   ├── pdf/         # Generación PDF (Fase 5)
│   ├── whatsapp/    # Compartir (Fase 5)
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

## Roadmap por fases

| Fase | Entregable | Estado |
|------|-----------|--------|
| 1 | Scaffold, PWA offline, UI base, capa de datos | ✅ |
| 2 | CRUD de materiales | ⏳ |
| 3 | Calculadora Cutting Stock 1D + proyectos | ⏳ |
| 4 | Motor de cotización + configuración | ⏳ |
| 5 | PDF cliente/taller + WhatsApp | ⏳ |
