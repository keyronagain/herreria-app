'use client';

import { Eye, Trash2, FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Proyecto, EstadoProyecto } from '@/types';

const ESTADOS: Record<
  EstadoProyecto,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  borrador: { label: 'Borrador', variant: 'default' },
  cotizado: { label: 'Cotizado', variant: 'info' },
  aprobado: { label: 'Aprobado', variant: 'success' },
  cerrado: { label: 'Cerrado', variant: 'warning' },
};

interface Props {
  proyectos: Proyecto[];
  cargando: boolean;
  onVer: (p: Proyecto) => void;
  onEliminar: (p: Proyecto) => void;
}

export function ProyectoList({
  proyectos,
  cargando,
  onVer,
  onEliminar,
}: Props) {
  if (cargando) {
    return <p className="py-16 text-center text-sm text-slate-500">Cargando…</p>;
  }

  if (proyectos.length === 0) {
    return (
      <EmptyState
        icono={<FolderKanban className="h-10 w-10" />}
        titulo="Sin proyectos"
        descripcion="Guarda un proyecto desde la Calculadora de cortes para verlo aquí."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {proyectos.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-slate-900">
                {p.nombre}
              </span>
              <Badge variant={ESTADOS[p.estado]?.variant ?? 'default'}>
                {ESTADOS[p.estado]?.label ?? p.estado}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {p.cliente ? `${p.cliente} · ` : ''}
              {p.piezas.length} pieza{p.piezas.length !== 1 ? 's' : ''} ·{' '}
              {new Date(p.creadoEn).toLocaleDateString('es-CR')}
            </p>
          </div>
          <button
            onClick={() => onVer(p)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Ver proyecto"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEliminar(p)}
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Eliminar proyecto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
