'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { parseNumero, formatCRC } from '@/lib/utils/format';
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
      <div className="rounded-md border border-dashed border-forge-edge/60 p-6 text-center text-sm text-forge-muted">
        Sin conceptos. Genera desde un proyecto o agrega manualmente.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conceptos.map((c) => (
        <div key={c.id} className="rounded-md border border-forge-edge bg-forge-surface p-3">
          <div className="flex gap-2">
            <Input
              value={c.descripcion}
              placeholder="Descripción"
              onChange={(e) => actualizar(c.id, { descripcion: e.target.value })}
            />
            <button
              type="button"
              onClick={() => eliminar(c.id)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-forge-ghost hover:bg-forge-red/10 hover:text-forge-red"
              aria-label="Eliminar concepto"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <label className="mb-0.5 block text-xs text-forge-ghost">
                Cantidad
              </label>
              <Input
                type="number"
                min="0"
                step="any"
                value={c.cantidad}
                onChange={(e) =>
                  actualizar(c.id, { cantidad: parseNumero(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-forge-ghost">
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
              <label className="mb-0.5 block text-xs text-forge-ghost">
                Costo unit.
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={c.costoUnitario}
                onChange={(e) =>
                  actualizar(c.id, {
                    costoUnitario: parseNumero(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-forge-ghost">
                Subtotal
              </label>
              <div className="flex h-11 items-center rounded-md bg-forge-elevated px-3 text-sm font-medium text-forge-platinum">
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
