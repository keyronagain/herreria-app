'use client';

import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uid } from '@/lib/utils/id';
import type { PiezaRequerida } from '@/types';

interface Props {
  materialId: string;
  largoBarra: number;
  kerfDefault: number;
  onAgregar: (pieza: PiezaRequerida) => void;
}

export function PiezaForm({
  materialId,
  largoBarra,
  kerfDefault,
  onAgregar,
}: Props) {
  const [descripcion, setDescripcion] = useState('');
  const [largo, setLargo] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [kerf, setKerf] = useState(String(kerfDefault));
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const l = parseFloat(largo);
    const k = parseFloat(kerf) || 0;

    if (!l || l <= 0) {
      setError('Ingresa un largo válido.');
      return;
    }
    if (l + k > largoBarra) {
      setError('La pieza excede el largo de la barra.');
      return;
    }

    onAgregar({
      id: uid(),
      materialId,
      descripcion: descripcion.trim() || `Pieza ${largo} cm`,
      cantidad: Math.max(1, parseInt(cantidad, 10) || 1),
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
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Descripción
          </label>
          <Input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Travesaño"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Largo (cm)
          </label>
          <Input
            type="number"
            min="0"
            step="0.1"
            value={largo}
            onChange={(e) => setLargo(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
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
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Kerf (cm)
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={kerf}
            onChange={(e) => setKerf(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <Button type="submit">
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>
    </form>
  );
}
