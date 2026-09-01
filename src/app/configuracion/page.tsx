'use client';

import { Settings } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ConfiguracionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
      <EmptyState
        icono={<Settings className="h-10 w-10" />}
        titulo="Configuración del taller"
        descripcion="Insumos, mano de obra, IVA y datos del taller se configuran en la Fase 4."
      />
    </div>
  );
}
