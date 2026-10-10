'use client';

import { Eye, Trash2, FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { INTERACTIVE_CARD } from '@/components/ui/Card';
import { ListaSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
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
    return <ListaSkeleton />;
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
          className={cn(
            'flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm',
            INTERACTIVE_CARD,
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <span className="break-words font-medium text-slate-100">
                {p.nombre}
              </span>
              <Badge
                className="shrink-0"
                variant={ESTADOS[p.estado]?.variant ?? 'default'}
              >
                {ESTADOS[p.estado]?.label ?? p.estado}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {p.cliente ? `${p.cliente} · ` : ''}
              {p.piezas.length} pieza{p.piezas.length !== 1 ? 's' : ''} ·{' '}
              {new Date(p.creadoEn).toLocaleDateString('es-CR')}
            </p>
          </div>
          <button
            onClick={() => onVer(p)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-700 active:scale-95"
            aria-label="Ver proyecto"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEliminar(p)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-900/30 hover:text-red-400 active:scale-95"
            aria-label="Eliminar proyecto"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
