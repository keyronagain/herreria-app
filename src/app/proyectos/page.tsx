'use client';

import { useState } from 'react';
import { ProyectoList } from '@/components/proyectos/ProyectoList';
import { ProyectoDetalle } from '@/components/proyectos/ProyectoDetalle';
import { useProyectos } from '@/hooks/use-proyectos';
import { useMateriales } from '@/hooks/use-materiales';
import { cotizacionRepository } from '@/lib/db/repositories';
import { useUIStore } from '@/stores/ui-store';
import type { Proyecto } from '@/types';

export default function ProyectosPage() {
  const { proyectos, cargando, eliminar } = useProyectos();
  const { materiales } = useMateriales();
  const proyectoIdParaCotizar = useUIStore((s) => s.proyectoIdParaCotizar);
  const setProyectoIdParaCotizar = useUIStore(
    (s) => s.setProyectoIdParaCotizar,
  );
  const [proyectoVer, setProyectoVer] = useState<Proyecto | null>(null);

  async function eliminarProyecto(p: Proyecto) {
    if (!window.confirm(`¿Eliminar el proyecto "${p.nombre}"?`)) return;
    await cotizacionRepository.desvincularProyecto(p.id);
    await eliminar(p.id);
    if (proyectoVer?.id === p.id) setProyectoVer(null);
    if (proyectoIdParaCotizar === p.id) setProyectoIdParaCotizar(null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-100">Proyectos</h1>
      <p className="mt-1 text-sm text-slate-400">
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
