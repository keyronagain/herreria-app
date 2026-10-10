'use client';

import { Plus, Trash2, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { INTERACTIVE_CARD } from '@/components/ui/Card';
import { ListaSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import { formatCRC } from '@/lib/utils/format';
import type { Cotizacion } from '@/types';

const ESTADOS: Record<
  Cotizacion['estado'],
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  borrador: { label: 'Borrador', variant: 'default' },
  enviada: { label: 'Enviada', variant: 'info' },
  aprobada: { label: 'Aprobada', variant: 'success' },
  rechazada: { label: 'Rechazada', variant: 'danger' },
};

interface Props {
  cotizaciones: Cotizacion[];
  cargando: boolean;
  onCrear: () => void;
  onVer: (c: Cotizacion) => void;
  onEliminar: (c: Cotizacion) => void;
}

export function CotizacionList({
  cotizaciones,
  cargando,
  onCrear,
  onVer,
  onEliminar,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onCrear}>
          <Plus className="h-4 w-4" /> Nueva cotización
        </Button>
      </div>

      {cargando ? (
        <ListaSkeleton />
      ) : cotizaciones.length === 0 ? (
        <EmptyState
          icono={<FileText className="h-10 w-10" />}
          titulo="Sin cotizaciones"
          descripcion="Crea tu primera cotización desde un proyecto o manualmente."
        />
      ) : (
        <ul className="space-y-2">
          {cotizaciones.map((c) => (
            <li
              key={c.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm',
                INTERACTIVE_CARD,
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-100">{c.numero}</span>
                  <Badge variant={ESTADOS[c.estado]?.variant ?? 'default'}>
                    {ESTADOS[c.estado]?.label ?? c.estado}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {c.cliente.nombre} ·{' '}
                  {new Date(c.fecha).toLocaleDateString('es-CR')}
                </p>
              </div>
              <span className="shrink-0 font-semibold text-slate-100">
                {formatCRC(c.totalConIva)}
              </span>
              <button
                onClick={() => onVer(c)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-700 active:scale-95"
                aria-label="Ver cotización"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEliminar(c)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-900/30 hover:text-red-400 active:scale-95"
                aria-label="Eliminar"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
