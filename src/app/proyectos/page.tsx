'use client';

import { useState } from 'react';
import { ProyectoList } from '@/components/proyectos/ProyectoList';
import { ProyectoDetalle } from '@/components/proyectos/ProyectoDetalle';
import { useProyectos } from '@/hooks/use-proyectos';
import { useMateriales } from '@/hooks/use-materiales';
import { useCotizaciones } from '@/hooks/use-cotizaciones';
import { useUIStore } from '@/stores/ui-store';
import type { Proyecto } from '@/types';

export default function ProyectosPage() {
  const { proyectos, cargando, eliminar } = useProyectos();
  const { materiales } = useMateriales();
  const { desvincularProyecto } = useCotizaciones();
  const mostrarToast = useUIStore((s) => s.mostrarToast);
  const [proyectoVer, setProyectoVer] = useState<Proyecto | null>(null);

  async function eliminarProyecto(p: Proyecto) {
    if (!window.confirm(`¿Eliminar el proyecto "${p.nombre}"?`)) return;
    try {
      await desvincularProyecto(p.id);
      await eliminar(p.id);
      if (proyectoVer?.id === p.id) setProyectoVer(null);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-forge-platinum">Proyectos</h1>
      <p className="mt-1 text-sm text-forge-muted">
        Trabajos guardados desde la calculadora de cortes.
      </p>

      <div className="mt-6">
        <ProyectoList
          proyectos={proyectos}
          cargando={cargando}
          onVer={setProyectoVer}
          onEliminar={eliminarProyecto}
        />
      </div>

      {proyectoVer && (
        <ProyectoDetalle
          proyecto={proyectoVer}
          materiales={materiales}
          onCerrar={() => setProyectoVer(null)}
        />
      )}
    </div>
  );
}
