'use client';

import { useState, type FormEvent } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConceptosTable } from './ConceptosTable';
import { parseNumero, formatCRC } from '@/lib/utils/format';
import {
  generarConceptos,
  generarPatrones,
  calcularManoObra,
  resumenPorTipo,
  recalcularTotales,
} from '@/lib/pricing/calcular-cotizacion';
import type {
  Proyecto,
  Material,
  ConfiguracionTaller,
  ConceptoCosto,
  Cotizacion,
  ModoManoObra,
  ResultadoOptimizacion,
} from '@/types';

export type DatosCotizacion = Omit<
  Cotizacion,
  'id' | 'numero' | 'creadoEn' | 'actualizadoEn'
>;

interface Props {
  proyectos: Proyecto[];
  materiales: Material[];
  config: ConfiguracionTaller;
  proyectoInicialId?: string;
  onCerrar: () => void;
  onGuardar: (datos: DatosCotizacion) => Promise<void>;
}

export function CotizacionForm({
  proyectos,
  materiales,
  config,
  proyectoInicialId,
  onCerrar,
  onGuardar,
}: Props) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [proyectoId, setProyectoId] = useState(proyectoInicialId ?? '');
  const [conceptos, setConceptos] = useState<ConceptoCosto[]>(() => {
    if (!proyectoInicialId) return [];
    const proyecto = proyectos.find((p) => p.id === proyectoInicialId);
    return proyecto
      ? generarConceptos(proyecto.piezas, materiales, config, 0)
      : [];
  });
  const [patrones, setPatrones] = useState<ResultadoOptimizacion[]>(() => {
    if (!proyectoInicialId) return [];
    const proyecto = proyectos.find((p) => p.id === proyectoInicialId);
    return proyecto ? generarPatrones(proyecto.piezas, materiales, config) : [];
  });
  const [modoManoObra, setModoManoObra] = useState<ModoManoObra>(
    config.modoManoObraDefault,
  );
  const [manoObraFijo, setManoObraFijo] = useState(0);
  const [horasManoObra, setHorasManoObra] = useState(0);
  const [pctManoObra, setPctManoObra] = useState(0);
  const [pctGanancia, setPctGanancia] = useState(config.pctGananciaDefault);
  const [aplicarIva, setAplicarIva] = useState(false);
  const [vigenciaDias, setVigenciaDias] = useState(15);
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);

  const { costoMaterial, costoInsumos } = resumenPorTipo(conceptos);
  const costoManoObra = calcularManoObra(
    modoManoObra,
    manoObraFijo,
    horasManoObra,
    pctManoObra,
    costoMaterial,
    config,
  );
  const totales = recalcularTotales(
    conceptos,
    costoManoObra,
    pctGanancia,
    config.ivaPct,
    aplicarIva,
  );

  function generar() {
    const proyecto = proyectos.find((p) => p.id === proyectoId);
    if (!proyecto) return;
    setConceptos(
      generarConceptos(proyecto.piezas, materiales, config, horasManoObra),
    );
    setPatrones(generarPatrones(proyecto.piezas, materiales, config));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombreCliente.trim()) return;

    setGuardando(true);
    try {
      await onGuardar({
        cliente: {
          nombre: nombreCliente.trim(),
          telefono: telefono.trim() || undefined,
          direccion: direccion.trim() || undefined,
        },
        proyectoId: proyectoId || undefined,
        fecha: Date.now(),
        vigenciaDias: Math.max(0, Math.round(vigenciaDias)),
        conceptos,
        patrones: patrones.length > 0 ? patrones : undefined,
        costoMaterial,
        costoInsumos,
        costoManoObra,
        subtotal: totales.subtotal,
        pctGanancia,
        ganancia: totales.ganancia,
        total: totales.total,
        aplicarIva,
        ivaPct: config.ivaPct,
        totalConIva: totales.totalConIva,
        modoManoObra,
        horasManoObra: modoManoObra === 'horas' ? horasManoObra : undefined,
        pctManoObra: modoManoObra === 'porcentaje' ? pctManoObra : undefined,
        notas: notas.trim() || undefined,
        estado: 'borrador',
      });
      onCerrar();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo="Nueva cotización"
      className="sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Cliente
            </label>
            <Input
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <Input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Dirección
            </label>
            <Input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>

        <Card className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Generar desde proyecto
              </label>
              <Select
                value={proyectoId}
                onChange={(e) => setProyectoId(e.target.value)}
              >
                <option value="">— Sin proyecto —</option>
                {proyectos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                    {p.cliente ? ` · ${p.cliente}` : ''}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={generar}
              disabled={!proyectoId}
            >
              <Sparkles className="h-4 w-4" /> Generar
            </Button>
          </div>
        </Card>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Conceptos
          </label>
          <ConceptosTable conceptos={conceptos} onChange={setConceptos} />
        </div>

        <Card className="space-y-3">
          <h3 className="font-semibold text-slate-900">Mano de obra</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Modo
              </label>
              <Select
                value={modoManoObra}
                onChange={(e) =>
                  setModoManoObra(e.target.value as ModoManoObra)
                }
              >
                <option value="fijo">Fijo</option>
                <option value="horas">Horas</option>
                <option value="porcentaje">Porcentaje</option>
              </Select>
            </div>
            {modoManoObra === 'fijo' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Monto (₡)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={manoObraFijo}
                  onChange={(e) => setManoObraFijo(parseNumero(e.target.value))}
                />
              </div>
            )}
            {modoManoObra === 'horas' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Horas
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={horasManoObra}
                  onChange={(e) =>
                    setHorasManoObra(parseNumero(e.target.value))
                  }
                />
              </div>
            )}
            {modoManoObra === 'porcentaje' && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  % sobre materiales
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={pctManoObra}
                  onChange={(e) => setPctManoObra(parseNumero(e.target.value))}
                />
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Mano de obra: {formatCRC(costoManoObra)}
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ganancia (%)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={pctGanancia}
                onChange={(e) => setPctGanancia(parseNumero(e.target.value))}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Vigencia (días)
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={vigenciaDias}
                onChange={(e) =>
                  setVigenciaDias(Math.round(parseNumero(e.target.value)))
                }
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={aplicarIva}
                onChange={(e) => setAplicarIva(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-500"
              />
              Aplicar IVA ({config.ivaPct}%)
            </label>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notas
            </label>
            <Input
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </Card>

        <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Material</span>
            <span>{formatCRC(costoMaterial)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Insumos</span>
            <span>{formatCRC(costoInsumos)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Mano de obra</span>
            <span>{formatCRC(costoManoObra)}</span>
          </div>
          <div className="flex justify-between font-medium text-slate-900">
            <span>Subtotal</span>
            <span>{formatCRC(totales.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Ganancia ({pctGanancia}%)</span>
            <span>{formatCRC(totales.ganancia)}</span>
          </div>
          {aplicarIva && (
            <div className="flex justify-between text-slate-600">
              <span>IVA ({config.ivaPct}%)</span>
              <span>{formatCRC(totales.iva)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCRC(totales.totalConIva)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            <Save className="h-4 w-4" />
            {guardando ? 'Guardando…' : 'Guardar cotización'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
