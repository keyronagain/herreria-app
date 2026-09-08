'use client';

import { useMemo, useState } from 'react';
import { Scissors, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { PiezaForm } from '@/components/calculadora/PiezaForm';
import { ListaPiezas } from '@/components/calculadora/ListaPiezas';
import { VistaBarras } from '@/components/calculadora/VistaBarras';
import { GuardarProyecto } from '@/components/calculadora/GuardarProyecto';
import { optimizarCortes } from '@/lib/cutting/optimizar';
import { useMateriales } from '@/hooks/use-materiales';
import { useProyectos } from '@/hooks/use-proyectos';
import { useConfig } from '@/hooks/use-config';
import { useUIStore } from '@/stores/ui-store';
import { formatCRC, formatMedida } from '@/lib/utils/format';
import type { PiezaRequerida, ResultadoOptimizacion } from '@/types';

export default function CalculadoraPage() {
  const { materiales, cargando: cargandoMateriales } = useMateriales();
  const { crear: crearProyecto } = useProyectos();
  const { config, cargando: cargandoConfig } = useConfig();
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  const [materialId, setMaterialId] = useState('');
  const [piezas, setPiezas] = useState<PiezaRequerida[]>([]);
  const [piezaEditando, setPiezaEditando] = useState<PiezaRequerida | null>(null);
  const [resultado, setResultado] = useState<ResultadoOptimizacion | null>(null);
  const [guardarAbierto, setGuardarAbierto] = useState(false);

  const material = useMemo(
    () => materiales.find((m) => m.id === materialId) ?? null,
    [materiales, materialId],
  );

  const listo = !cargandoMateriales && !cargandoConfig;

  function seleccionarMaterial(id: string) {
    setMaterialId(id);
    setPiezas([]);
    setPiezaEditando(null);
    setResultado(null);
  }

  function guardarPieza(pieza: PiezaRequerida) {
    setPiezas((p) =>
      p.some((x) => x.id === pieza.id)
        ? p.map((x) => (x.id === pieza.id ? pieza : x))
        : [...p, pieza],
    );
    setPiezaEditando(null);
    setResultado(null);
  }

  function editarPieza(id: string) {
    setPiezaEditando(piezas.find((p) => p.id === id) ?? null);
  }

  function eliminarPieza(id: string) {
    setPiezas((p) => p.filter((x) => x.id !== id));
    setPiezaEditando((e) => (e?.id === id ? null : e));
    setResultado(null);
  }

  function optimizar() {
    if (!material) return;
    setResultado(optimizarCortes(piezas, material.largoBarra, material.id));
    mostrarToast('Cortes calculados.', 'success');
  }

  async function guardarProyecto(nombre: string, cliente: string) {
    await crearProyecto({
      nombre,
      cliente,
      descripcion: material ? `Material: ${material.nombre}` : undefined,
      piezas,
      estado: 'borrador',
    });
    mostrarToast('Proyecto guardado.', 'success');
  }

  if (!listo) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="py-16 text-center text-sm text-slate-400">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Optimización de cortes
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Minimiza el desperdicio en barras de 6 m.
        </p>
      </div>

      <Card>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Material
        </label>
        <Select
          value={materialId}
          onChange={(e) => seleccionarMaterial(e.target.value)}
        >
          <option value="">Selecciona un material…</option>
          {materiales.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} — {formatMedida(m.largoBarra)} · {formatCRC(m.precioBarra)}
            </option>
          ))}
        </Select>
        {material && (
          <p className="mt-2 text-sm text-slate-400">
            Barra de {formatMedida(material.largoBarra)} ·{' '}
            {formatCRC(material.precioBarra)}/barra
          </p>
        )}
      </Card>

      {material ? (
        <>
          <PiezaForm
            key={piezaEditando?.id ?? 'nueva'}
            materialId={material.id}
            largoBarra={material.largoBarra}
            kerfDefault={config?.kerfDefault ?? 0.3}
            piezaInicial={piezaEditando}
            onGuardar={guardarPieza}
            onCancelarEdicion={() => setPiezaEditando(null)}
          />

          <ListaPiezas
            piezas={piezas}
            onEliminar={eliminarPieza}
            onEditar={editarPieza}
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={optimizar} disabled={piezas.length === 0}>
              <Scissors className="h-4 w-4" />
              Optimizar
            </Button>
            {resultado && (
              <Button
                variant="secondary"
                onClick={() => setGuardarAbierto(true)}
              >
                <Save className="h-4 w-4" />
                Guardar proyecto
              </Button>
            )}
          </div>

          {resultado && (
            <VistaBarras resultado={resultado} costoBarra={material.precioBarra} />
          )}
        </>
      ) : (
        <EmptyState
          icono={<Scissors className="h-10 w-10" />}
          titulo="Elige un material"
          descripcion="Selecciona el perfil para empezar a agregar piezas."
        />
      )}

      {guardarAbierto && (
        <GuardarProyecto
          onCerrar={() => setGuardarAbierto(false)}
          onGuardar={guardarProyecto}
        />
      )}
    </div>
  );
}
