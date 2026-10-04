'use client';

import { Save } from 'lucide-react';
import { useConfig } from '@/hooks/use-config';
import { ConfiguracionForm } from '@/components/configuracion/ConfiguracionForm';
import { SyncPanel } from '@/components/configuracion/SyncPanel';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/ui-store';
import { mensajeSupabase } from '@/lib/utils/error';
import type { ConfiguracionTaller } from '@/types';

const FORM_ID = 'configuracion-form';

export default function ConfiguracionPage() {
  const { config, cargando, guardar } = useConfig();
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  if (cargando || !config) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="py-16 text-center text-sm text-forge-muted">Cargando…</p>
      </div>
    );
  }

  async function handleGuardar(c: ConfiguracionTaller) {
    try {
      await guardar(c);
      mostrarToast('Configuración guardada correctamente.', 'success');
    } catch (err) {
      mostrarToast(mensajeSupabase(err), 'error');
      throw err; // re-throw para que ConfiguracionForm no marque sucio=false
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-forge-platinum">Configuración</h1>
        <Button form={FORM_ID} type="submit">
          <Save className="h-4 w-4" /> Guardar
        </Button>
      </div>
      <p className="mt-1 text-sm text-forge-muted">
        Insumos, mano de obra, IVA y datos del taller.
      </p>

      <div className="mt-6">
        <ConfiguracionForm
          config={config}
          formId={FORM_ID}
          onGuardar={handleGuardar}
        />
      </div>

      <div className="mt-6">
        <SyncPanel />
      </div>
    </div>
  );
}
