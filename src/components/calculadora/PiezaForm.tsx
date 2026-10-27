'use client';

import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uid } from '@/lib/utils/id';
import { parseNumero, formatMedida } from '@/lib/utils/format';
import { dividirEnTramos } from '@/lib/cutting/optimizar';
import type { PiezaRequerida } from '@/types';

interface Props {
  materialId: string;
  largoBarra: number;
  kerfDefault: number;
  piezaInicial?: PiezaRequerida | null;
  onGuardar: (pieza: PiezaRequerida) => void;
  onCancelarEdicion?: () => void;
}

export function PiezaForm({
  materialId,
  largoBarra,
  kerfDefault,
  piezaInicial,
  onGuardar,
  onCancelarEdicion,
}: Props) {
  const [descripcion, setDescripcion] = useState(
    piezaInicial?.descripcion ?? '',
  );
  const [largo, setLargo] = useState(
    piezaInicial ? String(piezaInicial.largo) : '',
  );
  const [cantidad, setCantidad] = useState(
    piezaInicial ? String(piezaInicial.cantidad) : '1',
  );
  const [kerf, setKerf] = useState(
    piezaInicial ? String(piezaInicial.kerf) : String(kerfDefault),
  );
  const [error, setError] = useState('');

  const editando = Boolean(piezaInicial);

  const tramos = dividirEnTramos(parseNumero(largo), largoBarra).length;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const l = parseNumero(largo);
    const k = parseNumero(kerf);
    const cant = Math.max(1, Math.round(parseNumero(cantidad)) || 1);

    if (!l) {
      setError('Ingresa un largo válido.');
      return;
    }
    if (k >= largoBarra) {
      setError('El kerf debe ser menor que el largo de la barra.');
      return;
    }

    onGuardar({
      id: piezaInicial?.id ?? uid(),
      materialId,
      descripcion: descripcion.trim() || `Pieza ${largo} cm`,
      cantidad: cant,
      largo: l,
      kerf: k,
    });

    setDescripcion('');
    setLargo('');
    setCantidad('1');
    setKerf(String(kerfDefault));
    setError('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Descripción
          </label>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Travesaño"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Largo (cm)
          </label>
          <Input
            type="number"
            min="0"
            step="any"
            value={largo}
            onChange={(e) => setLargo(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Cantidad
          </label>
          <Input
            type="number"
            min="1"
            step="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Kerf (cm)
          </label>
          <Input
            type="number"
            min="0"
            step="any"
            value={kerf}
            onChange={(e) => setKerf(e.target.value)}
          />
        </div>
      </div>

      {tramos > 1 && (
        <p className="mt-3 break-words text-sm text-orange-400">
          Esta pieza supera la barra de {formatMedida(largoBarra)}: se dividirá
          en {tramos} tramos (Requiere empate de soldadura).
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-red-400">{error}</p>
        <div className="flex gap-2">
          {editando && onCancelarEdicion && (
            <Button type="button" variant="ghost" onClick={onCancelarEdicion}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {!editando && <Plus className="h-4 w-4" />}
            {editando ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </div>
      </div>
    </form>
  );
}
