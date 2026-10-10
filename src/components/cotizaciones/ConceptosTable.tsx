'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { formatCRC } from '@/lib/utils/format';
import { uid } from '@/lib/utils/id';
import { UNIDADES } from '@/constants';
import type { ConceptoCosto } from '@/types';

interface Props {
  conceptos: ConceptoCosto[];
  onChange: (conceptos: ConceptoCosto[]) => void;
}

export function ConceptosTable({ conceptos, onChange }: Props) {
  function actualizar(id: string, cambios: Partial<ConceptoCosto>) {
    onChange(
      conceptos.map((c) => {
        if (c.id !== id) return c;
        const nuevo = { ...c, ...cambios };
        nuevo.subtotal =
          Math.round(nuevo.cantidad * nuevo.costoUnitario * 100) / 100;
        return nuevo;
      }),
    );
  }

  function agregar() {
    onChange([
      ...conceptos,
      {
        id: uid(),
        descripcion: '',
        tipo: 'otro',
        cantidad: 1,
        costoUnitario: 0,
        subtotal: 0,
      },
    ]);
  }

  function eliminar(id: string) {
    onChange(conceptos.filter((c) => c.id !== id));
  }

  if (conceptos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-600 p-6 text-center text-sm text-slate-400">
        Sin conceptos. Genera desde un proyecto o agrega manualmente.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conceptos.map((c) => (
        <div key={c.id} className="rounded-xl border border-slate-700 p-3">
          <div className="flex gap-2">
            <Input
              value={c.descripcion}
              placeholder="Descripción"
              onChange={(e) => actualizar(c.id, { descripcion: e.target.value })}
            />
            <button
              type="button"
              onClick={() => eliminar(c.id)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400"
              aria-label="Eliminar concepto"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">
                Cantidad
              </label>
              <NumberInput
                min="0"
                step="any"
                value={c.cantidad}
                onValueChange={(n) => actualizar(c.id, { cantidad: n })}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">
                Unidad
              </label>
              <Select
                value={c.unidad ?? ''}
                onChange={(e) => actualizar(c.id, { unidad: e.target.value })}
              >
                <option value="">—</option>
                {(c.unidad && !UNIDADES.includes(c.unidad as never)
                  ? [...UNIDADES, c.unidad]
                  : UNIDADES
                ).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">
                Costo unit.
              </label>
              <NumberInput
                min="0"
                step="1"
                value={c.costoUnitario}
                onValueChange={(n) => actualizar(c.id, { costoUnitario: n })}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-400">
                Subtotal
              </label>
              <div className="flex h-11 items-center rounded-xl bg-slate-700 px-3 text-sm font-medium text-slate-300">
                {formatCRC(c.subtotal)}
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={agregar}>
        <Plus className="h-4 w-4" /> Concepto
      </Button>
    </div>
  );
}
