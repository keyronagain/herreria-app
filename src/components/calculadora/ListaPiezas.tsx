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
          className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-slate-100">{p.descripcion}</p>
            <p className="text-sm text-slate-400">
              {formatMedida(p.largo)} × {p.cantidad}
              {p.kerf > 0 && ` · kerf ${p.kerf} cm`}
            </p>
          </div>
          <button
            onClick={() => onEditar(p.id)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-700"
            aria-label="Editar pieza"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEliminar(p.id)}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
            aria-label="Eliminar pieza"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
