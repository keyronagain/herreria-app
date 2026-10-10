@AGENTS.md

# FORJA OS — Contexto del Proyecto

## Visión General
Forja OS es una PWA conectada a Supabase (requiere conexión y sesión) diseñada a medida para un taller de herrería ("Machillo Welding"). 
Permite gestionar proyectos, optimizar cortes 1D de perfiles/tubos con gestión de kerf, calcular costos de insumos/mano de obra, y generar presupuestos formales en PDF o textos para compartir por WhatsApp.

## Stack Tecnológico
- **Frontend / PWA:** Next.js / React, Tailwind CSS, `manifest.ts` + `public/sw.js` (solo purga caches viejos).
- **Backend:** Supabase (PostgreSQL + RLS + Realtime) como única fuente de datos, Vercel (Deployment).
- **Lógica de Negocio / Modulos:**
  - Optimizador de cortes 1D con Kerf (algoritmo tipo Bin Packing).
  - Generación de PDF client-side (`jsPDF`) con paleta de color corporativa (#E31B23 Red, #2D2D2D Charcoal, #F4F4F4 Platinum).
  - Integración con Web Share API para WhatsApp.
  - Procesamiento de imágenes/logos con Canvas API (redimensionado a 512px).

## Arquitectura Actual (post-refactor)

- **Sin offline-first ni Service Worker de caché**: `public/sw.js` solo purga caches viejos. No hay IndexedDB/Dexie.
- **Supabase como fuente de verdad**: todos los hooks leen y escriben directo en Supabase. Realtime via `postgres_changes`.
- **Sin cola outbox ni sync-engine**: eliminados `lib/db/` y `lib/sync/` por completo.
- **Tablas tipadas**: `materiales`, `proyectos`, `cotizaciones`, `configuracion` (migración `0002_direct_tables.sql`). Columnas en camelCase entre comillas para coincidir 1:1 con los tipos TypeScript.
- **Seed automático**: los hooks detectan tabla vacía al primer login e insertan datos por defecto (`src/data/seed.ts`).

## Funcionalidades ya implementadas (no son tareas pendientes)

- **Multimaterial en el optimizador 1D:** un proyecto guarda planos de corte de varios materiales sin perder piezas al cambiar de material, y "Agregar a Cotización" consolida las barras de todos en la misma lista de conceptos.
- **Logo (`logoBase64`):** columna `TEXT` en `configuracion`; `ConfiguracionForm.tsx` guarda vía `useConfig.guardar()` (upsert directo, estado local inmediato).
