'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Save, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { InsumosList } from './InsumosList';
import { redimensionarImagen } from '@/lib/utils/imagen';
import { mensajeSupabase } from '@/lib/utils/error';
import { useUIStore } from '@/stores/ui-store';
import type { ConfiguracionTaller, ModoManoObra } from '@/types';

interface Props {
  config: ConfiguracionTaller;
  formId: string;
  onGuardar: (config: ConfiguracionTaller) => Promise<void>;
}

function copia(config: ConfiguracionTaller): ConfiguracionTaller {
  return { ...config, insumos: config.insumos.map((i) => ({ ...i })) };
}

export function ConfiguracionForm({ config, formId, onGuardar }: Props) {
  const [local, setLocal] = useState<ConfiguracionTaller>(() => copia(config));
  const [guardando, setGuardando] = useState(false);
  const [sucio, setSucio] = useState(false);
  const mostrarToast = useUIStore((s) => s.mostrarToast);
  const inputLogoRef = useRef<HTMLInputElement>(null);

  function setCampo<K extends keyof ConfiguracionTaller>(
    campo: K,
    valor: ConfiguracionTaller[K],
  ) {
    setLocal((c) => ({ ...c, [campo]: valor }));
    setSucio(true);
  }

  async function guardar() {
    setGuardando(true);
    try {
      await onGuardar({
        ...local,
        nombreTaller: local.nombreTaller.trim(),
        largoBarraDefault: local.largoBarraDefault || 600,
        insumos: local.insumos.map((i) => ({
          ...i,
          nombre: i.nombre.trim(),
          unidad: i.unidad.trim(),
        })),
      });
      setSucio(false);
    } catch (err) {
      mostrarToast(mensajeSupabase(err), 'error');
    } finally {
      setGuardando(false);
    }
  }

  function descartar() {
    setLocal(copia(config));
    setSucio(false);
  }

  function abrirSelectorLogo() {
    inputLogoRef.current?.click();
  }

  async function manejarLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await redimensionarImagen(file, 512);
      setCampo('logoBase64', dataUrl);
    } catch {
      mostrarToast('No se pudo cargar la imagen.', 'error');
    }
    e.target.value = '';
  }

  function quitarLogo() {
    setCampo('logoBase64', undefined);
  }

  return (
    <>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          void guardar();
        }}
        className="space-y-6"
      >
        <Card>
          <h2 className="mb-3 font-semibold text-slate-100">Taller</h2>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Nombre del taller
          </label>
          <Input
            value={local.nombreTaller}
            onChange={(e) => setCampo('nombreTaller', e.target.value)}
          />

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Logo
            </label>
            {local.logoBase64 ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={local.logoBase64}
                  alt="Logo del taller"
                  className="h-16 w-16 rounded-lg border border-slate-700 bg-slate-700 object-contain"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={abrirSelectorLogo}
                  >
                    <ImagePlus className="h-4 w-4" /> Cambiar
                  </Button>
                  <Button type="button" variant="ghost" onClick={quitarLogo}>
                    Quitar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={abrirSelectorLogo}
              >
                <ImagePlus className="h-4 w-4" /> Cargar logo
              </Button>
            )}
            <input
              ref={inputLogoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={manejarLogo}
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-slate-100">
            Mano de obra e impuestos
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Costo por hora (₡)
              </label>
              <NumberInput
                min="0"
                step="1"
                value={local.costoManoObraHora}
                onValueChange={(n) => setCampo('costoManoObraHora', n)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Modo por defecto
              </label>
              <Select
                value={local.modoManoObraDefault}
                onChange={(e) =>
                  setCampo(
                    'modoManoObraDefault',
                    e.target.value as ModoManoObra,
                  )
                }
              >
                <option value="fijo">Fijo</option>
                <option value="horas">Horas</option>
                <option value="porcentaje">Porcentaje</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Ganancia por defecto (%)
              </label>
              <NumberInput
                min="0"
                step="1"
                value={local.pctGananciaDefault}
                onValueChange={(n) => setCampo('pctGananciaDefault', n)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                IVA (%)
              </label>
              <NumberInput
                min="0"
                step="1"
                value={local.ivaPct}
                onValueChange={(n) => setCampo('ivaPct', n)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold text-slate-100">Corte</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Kerf por defecto (cm)
              </label>
              <NumberInput
                min="0"
                step="any"
                value={local.kerfDefault}
                onValueChange={(n) => setCampo('kerfDefault', n)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Largo de barra (cm)
              </label>
              <NumberInput
                min="1"
                step="1"
                value={local.largoBarraDefault}
                onValueChange={(n) => setCampo('largoBarraDefault', n)}
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
      </form>

      {sucio && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-lg gap-2 rounded-2xl border border-slate-700 bg-slate-800/95 p-2 shadow-lg backdrop-blur">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={descartar}
            >
              Descartar
            </Button>
            <Button
              type="submit"
              form={formId}
              className="flex-1"
              loading={guardando}
            >
              {!guardando && <Save className="h-4 w-4" />}
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
