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
import { cotizacionRepository } from '@/lib/db/repositories';
import { useUIStore } from '@/stores/ui-store';
import type { Cotizacion } from '@/types';

export default function CotizacionesPage() {
  const { cotizaciones, cargando, crear, eliminar } = useCotizaciones();
  const { proyectos } = useProyectos();
  const { materiales } = useMateriales();
  const { config } = useConfig();
  const proyectoPreseleccionado = useUIStore((s) => s.proyectoIdParaCotizar);
  const setProyectoPreseleccionado = useUIStore(
    (s) => s.setProyectoIdParaCotizar,
  );
  const [creando, setCreando] = useState(() =>
    Boolean(proyectoPreseleccionado),
  );
  const [cotizacionVer, setCotizacionVer] = useState<Cotizacion | null>(null);

  async function eliminarCotizacion(c: Cotizacion) {
    if (window.confirm(`¿Eliminar la cotización ${c.numero}?`)) {
      await eliminar(c.id);
    }
  }

  async function guardarCotizacion(datos: DatosCotizacion) {
    const numero = await cotizacionRepository.siguienteNumero();
    await crear({ ...datos, numero });
  }

  function cerrarFormulario() {
    setCreando(false);
    setProyectoPreseleccionado(null);
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
          proyectoInicialId={proyectoPreseleccionado ?? undefined}
          onCerrar={cerrarFormulario}
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
