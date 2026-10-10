'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TIPOS_PERFIL } from '@/constants';
import { parseNumero } from '@/lib/utils/format';
import { mensajeSupabase } from '@/lib/utils/error';
import { useUIStore } from '@/stores/ui-store';
import type { MaterialInput } from '@/hooks/use-materiales';
import type {
  Material,
  DimensionesMaterial,
  TipoPerfil,
} from '@/types';

interface Props {
  material: Material | null;
  onCerrar: () => void;
  onGuardar: (input: MaterialInput, id?: string) => Promise<void>;
}

const TIPOS_CON_ANCHO: TipoPerfil[] = [
  'PTR',
  'TUBO_CUADRADO',
  'ANGULO',
  'PLATINA',
  'SOLERA',
  'CUSTOM',
];
const TIPOS_CON_ALTO: TipoPerfil[] = ['PTR', 'TUBO_CUADRADO', 'CUSTOM'];
const TIPOS_CON_DIAMETRO: TipoPerfil[] = ['TUBO_REDONDO', 'VARILLA', 'CUSTOM'];
const TIPOS_CON_ESPESOR: TipoPerfil[] = [
  'PTR',
  'TUBO_CUADRADO',
  'TUBO_REDONDO',
  'ANGULO',
  'PLATINA',
  'SOLERA',
  'CUSTOM',
];

interface FormValues {
  nombre: string;
  tipo: TipoPerfil;
  ancho: string;
  alto: string;
  diametro: string;
  espesor: string;
  largoBarra: string;
  precioBarra: string;
  unidad: 'metro' | 'pieza';
  proveedor: string;
}

const VALORES_INICIALES: FormValues = {
  nombre: '',
  tipo: 'PTR',
  ancho: '',
  alto: '',
  diametro: '',
  espesor: '',
  largoBarra: '600',
  precioBarra: '',
  unidad: 'metro',
  proveedor: '',
};

function valoresDe(material: Material | null): FormValues {
  if (!material) return { ...VALORES_INICIALES };
  return {
    nombre: material.nombre,
    tipo: material.tipo,
    ancho: material.dims.ancho?.toString() ?? '',
    alto: material.dims.alto?.toString() ?? '',
    diametro: material.dims.diametro?.toString() ?? '',
    espesor: material.dims.espesor?.toString() ?? '',
    largoBarra: material.largoBarra.toString(),
    precioBarra: material.precioBarra.toString(),
    unidad: material.unidad,
    proveedor: material.proveedor ?? '',
  };
}

export function MaterialForm({ material, onCerrar, onGuardar }: Props) {
  const [values, setValues] = useState<FormValues>(() => valoresDe(material));
  const [guardando, setGuardando] = useState(false);
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  function setCampo<K extends keyof FormValues>(campo: K, valor: FormValues[K]) {
    setValues((v) => ({ ...v, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nombre = values.nombre.trim();
    if (!nombre) return;

    const dims: DimensionesMaterial = {};
    if (TIPOS_CON_ANCHO.includes(values.tipo) && parseNumero(values.ancho) > 0) {
      dims.ancho = parseNumero(values.ancho);
    }
    if (TIPOS_CON_ALTO.includes(values.tipo) && parseNumero(values.alto) > 0) {
      dims.alto = parseNumero(values.alto);
    }
    if (TIPOS_CON_DIAMETRO.includes(values.tipo) && parseNumero(values.diametro) > 0) {
      dims.diametro = parseNumero(values.diametro);
    }
    if (TIPOS_CON_ESPESOR.includes(values.tipo) && parseNumero(values.espesor) > 0) {
      dims.espesor = parseNumero(values.espesor);
    }

    const largoBarra = parseNumero(values.largoBarra) || 600;
    const precioBarra = parseNumero(values.precioBarra);
    const precioUnitario =
      Math.round((precioBarra / (largoBarra / 100)) * 100) / 100;

    setGuardando(true);
    try {
      await onGuardar(
        {
          nombre,
          tipo: values.tipo,
          dims,
          largoBarra,
          precioBarra,
          precioUnitario,
          unidad: values.unidad,
          categoria: values.tipo,
          proveedor: values.proveedor.trim() || undefined,
          activo: material?.activo ?? true,
        },
        material?.id,
      );
      onCerrar();
    } catch (err) {
      mostrarToast(mensajeSupabase(err), 'error');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={material ? 'Editar material' : 'Nuevo material'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Nombre
          </label>
          <Input
            value={values.nombre}
            onChange={(e) => setCampo('nombre', e.target.value)}
            placeholder="Ej. PTR 2x1 cal.14"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Tipo
            </label>
            <Select
              value={values.tipo}
              onChange={(e) => setCampo('tipo', e.target.value as TipoPerfil)}
            >
              {TIPOS_PERFIL.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Unidad de venta
            </label>
            <Select
              value={values.unidad}
              onChange={(e) =>
                setCampo('unidad', e.target.value as 'metro' | 'pieza')
              }
            >
              <option value="metro">Metro</option>
              <option value="pieza">Pieza</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Precio por barra (₡)
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              value={values.precioBarra}
              onChange={(e) => setCampo('precioBarra', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Largo de barra (cm)
            </label>
            <Input
              type="number"
              min="1"
              step="1"
              value={values.largoBarra}
              onChange={(e) => setCampo('largoBarra', e.target.value)}
            />
          </div>
        </div>

        <fieldset className="rounded-xl border border-slate-700 p-3">
          <legend className="px-1 text-xs font-medium text-slate-400">
            Dimensiones (opcional, cm)
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {TIPOS_CON_ANCHO.includes(values.tipo) && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Ancho (cm)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={values.ancho}
                  onChange={(e) => setCampo('ancho', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            {TIPOS_CON_ALTO.includes(values.tipo) && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Alto (cm)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={values.alto}
                  onChange={(e) => setCampo('alto', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            {TIPOS_CON_DIAMETRO.includes(values.tipo) && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Diámetro (cm)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={values.diametro}
                  onChange={(e) => setCampo('diametro', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            {TIPOS_CON_ESPESOR.includes(values.tipo) && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Espesor (cm)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={values.espesor}
                  onChange={(e) => setCampo('espesor', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </fieldset>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Proveedor
          </label>
          <Input
            value={values.proveedor}
            onChange={(e) => setCampo('proveedor', e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" loading={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
