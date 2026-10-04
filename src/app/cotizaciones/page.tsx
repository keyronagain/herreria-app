'use client';

import { useState } from 'react';
import { CotizacionList } from '@/components/cotizaciones/CotizacionList';
import {
  CotizacionForm,
  type DatosCotizacion,
} from '@/components/cotizaciones/CotizacionForm';
import { CotizacionDetalle } from '@/components/cotizaciones/CotizacionDetalle';
import { useCotizaciones } from '@/hooks/use-cotizaciones';
import { useProyectos } from '@/hooks/use-proyectos';
import { useMateriales } from '@/hooks/use-materiales';
import { useConfig } from '@/hooks/use-config';
import { useUIStore } from '@/stores/ui-store';
import type { Cotizacion } from '@/types';

export default function CotizacionesPage() {
  const { cotizaciones, cargando, crear, eliminar, siguienteNumero } = useCotizaciones();
  const { proyectos } = useProyectos();
  const { materiales } = useMateriales();
  const { config } = useConfig();
  const mostrarToast = useUIStore((s) => s.mostrarToast);
  const [creando, setCreando] = useState(false);
  const [cotizacionVer, setCotizacionVer] = useState<Cotizacion | null>(null);

  async function eliminarCotizacion(c: Cotizacion) {
    if (window.confirm(`¿Eliminar la cotización ${c.numero}?`)) {
      try {
        await eliminar(c.id);
      } catch (err) {
        mostrarToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
      }
    }
  }

  async function guardarCotizacion(datos: DatosCotizacion) {
    try {
      const numero = siguienteNumero();
      await crear({ ...datos, numero });
      mostrarToast(`Cotización ${numero} guardada.`, 'success');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Error al guardar la cotización', 'error');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-100">Cotizaciones</h1>
      <p className="mt-1 text-sm text-slate-400">
        Cotizaciones automáticas con material, insumos, mano de obra y ganancia.
      </p>

      <div className="mt-6">
        <CotizacionList
          cotizaciones={cotizaciones}
          cargando={cargando}
          onCrear={() => setCreando(true)}
          onVer={setCotizacionVer}
          onEliminar={eliminarCotizacion}
        />
      </div>

      {creando && config && (
        <CotizacionForm
          proyectos={proyectos}
          materiales={materiales}
          config={config}
          onCerrar={() => setCreando(false)}
          onGuardar={guardarCotizacion}
        />
      )}

      {cotizacionVer && config && (
        <CotizacionDetalle
          cotizacion={cotizacionVer}
          config={config}
          materiales={materiales}
          proyectos={proyectos}
          onCerrar={() => setCotizacionVer(null)}
        />
      )}
    </div>
  );
}
