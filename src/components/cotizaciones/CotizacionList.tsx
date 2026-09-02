'use client';

import { Plus, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
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
  onEliminar: (c: Cotizacion) => void;
}

export function CotizacionList({
  cotizaciones,
  cargando,
  onCrear,
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
        <p className="py-16 text-center text-sm text-slate-500">Cargando…</p>
      ) : cotizaciones.length === 0 ? (
        <EmptyState
          icono={<FileText className="h-10 w-10" />}
          titulo="Sin cotizaciones"
          descripcion="Crea tu primera cotización desde un proyecto o manualmente."
          accion={
            <Button onClick={onCrear}>
              <Plus className="h-4 w-4" /> Nueva cotización
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {cotizaciones.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{c.numero}</span>
                  <Badge variant={ESTADOS[c.estado]?.variant ?? 'default'}>
                    {ESTADOS[c.estado]?.label ?? c.estado}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {c.cliente.nombre} ·{' '}
                  {new Date(c.fecha).toLocaleDateString('es-CR')}
                </p>
              </div>
              <span className="shrink-0 font-semibold text-slate-900">
                {formatCRC(c.totalConIva)}
              </span>
              <button
                onClick={() => onEliminar(c)}
                className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
