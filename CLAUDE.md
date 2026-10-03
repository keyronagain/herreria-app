@AGENTS.md

# FORJA OS — Contexto del Proyecto

## Visión General
Forja OS es una PWA Local-First / Offline-First diseñada a medida para un taller de herrería ("Machillo Welding"). 
Permite gestionar proyectos, optimizar cortes 1D de perfiles/tubos con gestión de kerf, calcular costos de insumos/mano de obra, y generar presupuestos formales en PDF o textos para compartir por WhatsApp.

## Stack Tecnológico
- **Frontend / PWA:** Next.js / React, Tailwind CSS, Service Workers (PWA offline caching).
- **Almacenamiento Local (Local-First):** IndexedDB / LocalStorage para persistencia inmediata offline.
- **Backend & Sync:** Supabase (PostgreSQL), Vercel (Deployment).
- **Motor de Sync:** Custom `sync-engine.ts` con cola de eventos (`outbox`) y resolución de conflictos para sincronización bidireccional (`push`/`pull`).
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

## Tareas Prioritarias

### 1. Soporte Multimaterial en el Optimizador de Cortes 1D
- Permitir guardar y asociar planos de corte de **MÚLTIPLES materiales distintos** bajo un mismo `proyecto_id`.
- Evitar que al cambiar de material en el selector de la UI se limpie la lista de piezas o se pierdan los cálculos previos.
- Al hacer clic en "Agregar a Cotización", consolidar y acumular todas las barras necesarias de los diferentes materiales dentro de la misma lista de insumos de la cotización.

### 2. Logo (`logoBase64`) en Configuración
- El campo `logoBase64` en Supabase es `TEXT`, admite cadenas largas sin truncar el Base64 de 512px.
- Al guardar en `ConfiguracionForm.tsx`, el hook `useConfig.guardar()` hace upsert directo y actualiza el estado local inmediatamente.
