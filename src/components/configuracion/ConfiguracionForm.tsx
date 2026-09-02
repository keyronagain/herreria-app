'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { InsumosList } from './InsumosList';
import { parseNumero } from '@/lib/utils/format';
import type { ConfiguracionTaller, ModoManoObra } from '@/types';

interface Props {
  config: ConfiguracionTaller;
  onGuardar: (config: ConfiguracionTaller) => Promise<void>;
}

export function ConfiguracionForm({ config, onGuardar }: Props) {
  const [local, setLocal] = useState<ConfiguracionTaller>(() => ({
    ...config,
    insumos: config.insumos.map((i) => ({ ...i })),
  }));
  const [guardando, setGuardando] = useState(false);

  function setCampo<K extends keyof ConfiguracionTaller>(
    campo: K,
    valor: ConfiguracionTaller[K],
  ) {
    setLocal((c) => ({ ...c, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    try {
      await onGuardar({
        ...local,
        nombreTaller: local.nombreTaller.trim(),
        insumos: local.insumos.map((i) => ({
          ...i,
          nombre: i.nombre.trim(),
          unidad: i.unidad.trim(),
        })),
      });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void guardar();
      }}
      className="space-y-6"
    >
      <Card>
        <h2 className="mb-3 font-semibold text-slate-900">Taller</h2>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nombre del taller
        </label>
        <Input
          value={local.nombreTaller}
          onChange={(e) => setCampo('nombreTaller', e.target.value)}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-slate-900">Mano de obra e impuestos</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Costo por hora (₡)
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={local.costoManoObraHora}
              onChange={(e) =>
                setCampo('costoManoObraHora', parseNumero(e.target.value))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Modo por defecto
            </label>
            <Select
              value={local.modoManoObraDefault}
              onChange={(e) =>
                setCampo('modoManoObraDefault', e.target.value as ModoManoObra)
              }
            >
              <option value="fijo">Fijo</option>
              <option value="horas">Horas</option>
              <option value="porcentaje">Porcentaje</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Ganancia por defecto (%)
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={local.pctGananciaDefault}
              onChange={(e) =>
                setCampo('pctGananciaDefault', parseNumero(e.target.value))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              IVA (%)
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={local.ivaPct}
              onChange={(e) => setCampo('ivaPct', parseNumero(e.target.value))}
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-semibold text-slate-900">Corte</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Kerf por defecto (cm)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={local.kerfDefault}
              onChange={(e) =>
                setCampo('kerfDefault', parseNumero(e.target.value))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Largo de barra (cm)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={local.largoBarraDefault}
              onChange={(e) =>
                setCampo(
                  'largoBarraDefault',
                  parseNumero(e.target.value) || 600,
                )
              }
            />
          </div>
        </div>
      </Card>

      <Card>
        <InsumosList
          insumos={local.insumos}
          onChange={(insumos) => setCampo('insumos', insumos)}
        />
      </Card>

      <Button type="submit" disabled={guardando}>
        <Save className="h-4 w-4" />
        {guardando ? 'Guardando…' : 'Guardar configuración'}
      </Button>
    </form>
  );
}
