'use client';

import { Trash2, Ruler, Pencil } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatMedida } from '@/lib/utils/format';
import type { PiezaRequerida } from '@/types';

interface Props {
  piezas: PiezaRequerida[];
  onEliminar: (id: string) => void;
  onEditar: (id: string) => void;
}

export function ListaPiezas({ piezas, onEliminar, onEditar }: Props) {
  if (piezas.length === 0) {
    return (
      <EmptyState
        icono={<Ruler className="h-10 w-10" />}
        titulo="Sin piezas"
        descripcion="Agrega piezas para optimizar el corte."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {piezas.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-3 rounded-lg border border-forge-edge bg-forge-surface p-3 transition-colors hover:bg-forge-elevated"
        >
          <div className="min-w-0 flex-1">
            <p className="break-words font-medium text-forge-platinum">
              {p.descripcion}
            </p>
            <p className="text-sm text-forge-muted">
              {formatMedida(p.largo)} × {p.cantidad}
              {p.kerf > 0 && ` · kerf ${p.kerf} cm`}
            </p>
          </div>
          <button
            onClick={() => onEditar(p.id)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-forge-ghost hover:bg-forge-edge hover:text-forge-platinum"
            aria-label="Editar pieza"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEliminar(p.id)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-forge-ghost hover:bg-forge-red/10 hover:text-forge-red"
            aria-label="Eliminar pieza"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
