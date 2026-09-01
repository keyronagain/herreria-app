'use client';

import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CotizacionesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Cotizaciones</h1>
      <EmptyState
        icono={<FileText className="h-10 w-10" />}
        titulo="Cotizaciones automáticas"
        descripcion="El motor de cotización (material + insumos + mano de obra + ganancia) llega en la Fase 4."
      />
    </div>
  );
}
