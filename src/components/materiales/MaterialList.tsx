'use client';

import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TIPOS_PERFIL } from '@/constants';
import { formatCRC, formatMedida } from '@/lib/utils/format';
import type { Material } from '@/types';

interface Props {
  materiales: Material[];
  cargando: boolean;
  onCrear: () => void;
  onEditar: (m: Material) => void;
  onEliminar: (m: Material) => void;
}

function etiquetaTipo(tipo: string): string {
  return TIPOS_PERFIL.find((t) => t.value === tipo)?.label ?? tipo;
}

export function MaterialList({
  materiales,
  cargando,
  onCrear,
  onEditar,
  onEliminar,
}: Props) {
  const [termino, setTermino] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const filtrados = useMemo(() => {
    const t = termino.trim().toLowerCase();
    return materiales.filter((m) => {
      if (filtroTipo && m.tipo !== filtroTipo) return false;
      if (!t) return true;
      return (
        m.nombre.toLowerCase().includes(t) ||
        (m.categoria ?? '').toLowerCase().includes(t) ||
        (m.proveedor ?? '').toLowerCase().includes(t)
      );
    });
  }, [materiales, termino, filtroTipo]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            className="pl-9"
            placeholder="Buscar material…"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-56"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {TIPOS_PERFIL.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <Button onClick={onCrear}>
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {cargando ? (
        <p className="py-16 text-center text-sm text-slate-400">Cargando…</p>
      ) : filtrados.length === 0 ? (
        <EmptyState
          icono={<Layers className="h-10 w-10" />}
          titulo="Sin materiales"
          descripcion="Agrega tu primer material para armar el catálogo."
          accion={
            <Button onClick={onCrear}>
              <Plus className="h-4 w-4" />
              Nuevo material
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {filtrados.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-slate-100">
                    {m.nombre}
                  </span>
                  <Badge>{etiquetaTipo(m.tipo)}</Badge>
                  {m.categoria && <Badge variant="info">{m.categoria}</Badge>}
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  {formatCRC(m.precioBarra)} / barra {formatMedida(m.largoBarra)}
                  {' · '}
                  {formatCRC(m.precioUnitario)} / m
                </p>
              </div>
              <button
                onClick={() => onEditar(m)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEliminar(m)}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
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
