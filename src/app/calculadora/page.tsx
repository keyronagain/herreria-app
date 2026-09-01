'use client';

import { Scissors } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CalculadoraPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Optimización de cortes</h1>
      <EmptyState
        icono={<Scissors className="h-10 w-10" />}
        titulo="Calculadora de cortes 1D"
        descripcion="La optimización de cortes en barras de 6 m (Cutting Stock Problem) llega en la Fase 3."
      />
    </div>
  );
}
