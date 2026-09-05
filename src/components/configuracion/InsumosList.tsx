'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { uid } from '@/lib/utils/id';
import { parseNumero } from '@/lib/utils/format';
import { UNIDADES } from '@/constants';
import type { Insumo, ModoConsumo } from '@/types';

const MODOS: { value: ModoConsumo; label: string }[] = [
  { value: 'metro_lineal', label: 'Por metro lineal' },
  { value: 'por_pieza', label: 'Por pieza' },
  { value: 'por_hora', label: 'Por hora' },
  { value: 'por_kg', label: 'Por kg (manual)' },
];

interface Props {
  insumos: Insumo[];
  onChange: (insumos: Insumo[]) => void;
}

export function InsumosList({ insumos, onChange }: Props) {
  function actualizar(id: string, cambios: Partial<Insumo>) {
    onChange(insumos.map((i) => (i.id === id ? { ...i, ...cambios } : i)));
  }

  function agregar() {
    onChange([
      ...insumos,
      {
        id: uid(),
        nombre: '',
        costoUnitario: 0,
        unidad: 'u',
        modoConsumo: 'metro_lineal',
        factor: 1,
      },
    ]);
  }

  function eliminar(id: string) {
    onChange(insumos.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-100">Insumos</h2>
        <Button type="button" size="sm" variant="secondary" onClick={agregar}>
          <Plus className="h-4 w-4" /> Insumo
        </Button>
      </div>

      {insumos.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          Sin insumos configurados.
        </p>
      ) : (
        insumos.map((i) => (
          <div
            key={i.id}
            className="space-y-2 rounded-xl border border-slate-700 p-3"
          >
            <div className="flex gap-2">
              <Input
                value={i.nombre}
                placeholder="Nombre del insumo"
                onChange={(e) => actualizar(i.id, { nombre: e.target.value })}
              />
              <button
                type="button"
                onClick={() => eliminar(i.id)}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
                aria-label="Eliminar insumo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Input
                type="number"
                min="0"
                step="1"
                value={i.costoUnitario}
                placeholder="Costo (₡)"
                onChange={(e) =>
                  actualizar(i.id, { costoUnitario: parseNumero(e.target.value) })
                }
              />
              <Select
                value={i.unidad}
                onChange={(e) => actualizar(i.id, { unidad: e.target.value })}
              >
                <option value="">—</option>
                {(i.unidad && !UNIDADES.includes(i.unidad as never)
                  ? [...UNIDADES, i.unidad]
                  : UNIDADES
                ).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
              <Select
                value={i.modoConsumo}
                onChange={(e) =>
                  actualizar(i.id, {
                    modoConsumo: e.target.value as ModoConsumo,
                  })
                }
              >
                {MODOS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
              <Input
                type="number"
                min="0"
                step="any"
                value={i.factor}
                placeholder="Factor"
                onChange={(e) =>
                  actualizar(i.id, { factor: parseNumero(e.target.value) })
                }
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
