'use client';

import { FolderKanban } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ProyectosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
      <EmptyState
        icono={<FolderKanban className="h-10 w-10" />}
        titulo="Proyectos guardados"
        descripcion="La gestión de proyectos (piezas y patrones de corte) llega en la Fase 3."
      />
    </div>
  );
}
