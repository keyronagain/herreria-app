'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { parseNumero, formatCRC } from '@/lib/utils/format';
import { uid } from '@/lib/utils/id';
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
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        Sin conceptos. Genera desde un proyecto o agrega manualmente.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conceptos.map((c) => (
        <div key={c.id} className="rounded-xl border border-slate-200 p-3">
          <div className="flex gap-2">
            <Input
              value={c.descripcion}
              placeholder="Descripción"
              onChange={(e) => actualizar(c.id, { descripcion: e.target.value })}
            />
            <button
              type="button"
              onClick={() => eliminar(c.id)}
              className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
              aria-label="Eliminar concepto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <div>
              <label className="mb-0.5 block text-xs text-slate-500">
                Cantidad
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={c.cantidad}
                onChange={(e) =>
                  actualizar(c.id, { cantidad: parseNumero(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-500">
                Unidad
              </label>
              <Input
                value={c.unidad ?? ''}
                placeholder="u"
                onChange={(e) => actualizar(c.id, { unidad: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-slate-500">
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
              <label className="mb-0.5 block text-xs text-slate-500">
                Subtotal
              </label>
              <div className="flex h-11 items-center rounded-xl bg-slate-100 px-3 text-sm font-medium text-slate-700">
                {formatCRC(c.subtotal)}
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={agregar}>
        <Plus className="h-4 w-4" /> Concepto
      </Button>
    </div>
  );
}
