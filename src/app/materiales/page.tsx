'use client';

import { Layers } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MaterialesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Materiales</h1>
      <EmptyState
        icono={<Layers className="h-10 w-10" />}
        titulo="Catálogo de materiales"
        descripcion="El CRUD completo de materiales (perfiles, costos y búsqueda) llega en la Fase 2."
      />
    </div>
  );
}
