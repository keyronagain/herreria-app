'use client';

import { useConfig } from '@/hooks/use-config';
import { ConfiguracionForm } from '@/components/configuracion/ConfiguracionForm';

export default function ConfiguracionPage() {
  const { config, cargando, guardar } = useConfig();

  if (cargando || !config) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="py-16 text-center text-sm text-slate-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
      <p className="mt-1 text-sm text-slate-500">
        Insumos, mano de obra, IVA y datos del taller.
      </p>

      <div className="mt-6">
        <ConfiguracionForm config={config} onGuardar={guardar} />
      </div>
    </div>
  );
}
