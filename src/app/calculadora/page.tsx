'use client';

import { useMemo, useState } from 'react';
import { FileText, Save, Scissors } from 'lucide-react';
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
import { useCotizaciones } from '@/hooks/use-cotizaciones';
import { useConfig } from '@/hooks/use-config';
import { useUIStore } from '@/stores/ui-store';
import { uid } from '@/lib/utils/id';
import { formatCRC, formatMedida } from '@/lib/utils/format';
import type { ConceptoCosto, PiezaRequerida, ResultadoOptimizacion } from '@/types';

export default function CalculadoraPage() {
  const { materiales, cargando: cargandoMateriales } = useMateriales();
  const { crear: crearProyecto } = useProyectos();
  const { crear: crearCotizacion, siguienteNumero } = useCotizaciones();
  const { config, cargando: cargandoConfig } = useConfig();
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  const [materialId, setMaterialId] = useState('');
  const [piezas, setPiezas] = useState<PiezaRequerida[]>([]);
  const [piezaEditando, setPiezaEditando] = useState<PiezaRequerida | null>(null);
  const [resultados, setResultados] = useState<Record<string, ResultadoOptimizacion>>({});
  const [modoGuardar, setModoGuardar] = useState<'proyecto' | 'cotizacion' | null>(null);

  const material = useMemo(
    () => materiales.find((m) => m.id === materialId) ?? null,
    [materiales, materialId],
  );

  const piezasDelMaterial = useMemo(
    () => piezas.filter((p) => p.materialId === materialId),
    [piezas, materialId],
  );

  const resultadoActual = materialId ? (resultados[materialId] ?? null) : null;

  const materialesConPiezas = useMemo(() => {
    const ids = [...new Set(piezas.map((p) => p.materialId))];
    return ids
      .map((id) => ({
        mat: materiales.find((m) => m.id === id)!,
        conteo: piezas.filter((p) => p.materialId === id).length,
        resultado: resultados[id] ?? null,
      }))
      .filter((x) => x.mat);
  }, [piezas, materiales, resultados]);

  const hayResultados = Object.keys(resultados).length > 0;

  const costoTotalMaterial = useMemo(
    () =>
      materialesConPiezas.reduce(
        (s, { mat, resultado }) =>
          resultado ? s + resultado.totalBarras * mat.precioBarra : s,
        0,
      ),
    [materialesConPiezas],
  );

  const listo = !cargandoMateriales && !cargandoConfig;

  function seleccionarMaterial(id: string) {
    setMaterialId(id);
    setPiezaEditando(null);
    // Los piezas y resultados de otros materiales se conservan
  }

  function guardarPieza(pieza: PiezaRequerida) {
    setPiezas((p) =>
      p.some((x) => x.id === pieza.id)
        ? p.map((x) => (x.id === pieza.id ? pieza : x))
        : [...p, pieza],
    );
    setPiezaEditando(null);
    setResultados((r) => {
      const n = { ...r };
      delete n[pieza.materialId];
      return n;
    });
  }

  function editarPieza(id: string) {
    const pieza = piezas.find((p) => p.id === id);
    if (!pieza) return;
    setPiezaEditando(pieza);
    setMaterialId(pieza.materialId);
  }

  function eliminarPieza(id: string) {
    const pieza = piezas.find((p) => p.id === id);
    setPiezas((p) => p.filter((x) => x.id !== id));
    setPiezaEditando((e) => (e?.id === id ? null : e));
    if (pieza) {
      setResultados((r) => {
        const n = { ...r };
        delete n[pieza.materialId];
        return n;
      });
    }
  }

  function optimizar() {
    if (!material || piezasDelMaterial.length === 0) return;
    const res = optimizarCortes(piezasDelMaterial, material.largoBarra, material.id);
    setResultados((r) => ({ ...r, [materialId]: res }));
    mostrarToast('Cortes calculados.', 'success');
  }

  async function guardarProyecto(nombre: string, cliente: string) {
    try {
      await crearProyecto({ nombre, cliente, piezas, estado: 'borrador' });
      setModoGuardar(null);
      mostrarToast('Proyecto guardado.', 'success');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Error al guardar el proyecto', 'error');
    }
  }

  async function agregarACotizacion(nombre: string, cliente: string) {
    try {
    await crearProyecto({ nombre, cliente, piezas, estado: 'cotizado' });

    const conceptos: ConceptoCosto[] = materialesConPiezas
      .filter(({ resultado }) => resultado !== null)
      .map(({ mat, resultado }) => ({
        id: uid(),
        descripcion: `${mat.nombre} — ${resultado!.totalBarras} ${resultado!.totalBarras === 1 ? 'barra' : 'barras'}`,
        tipo: 'material' as const,
        cantidad: resultado!.totalBarras,
        unidad: 'barra',
        costoUnitario: mat.precioBarra,
        subtotal: resultado!.totalBarras * mat.precioBarra,
      }));

    const costoMaterial = conceptos.reduce((s, c) => s + c.subtotal, 0);
    const pct = config?.pctGananciaDefault ?? 30;
    const ganancia = Math.round((costoMaterial * pct) / 100);
    const total = costoMaterial + ganancia;

    await crearCotizacion({
      numero: siguienteNumero(),
      cliente: { nombre: cliente },
      fecha: Date.now(),
      vigenciaDias: 30,
      conceptos,
      patrones: Object.values(resultados),
      costoMaterial,
      costoInsumos: 0,
      costoManoObra: 0,
      subtotal: costoMaterial,
      pctGanancia: pct,
      ganancia,
      total,
      aplicarIva: false,
      ivaPct: config?.ivaPct ?? 13,
      totalConIva: total,
      modoManoObra: config?.modoManoObraDefault ?? 'fijo',
      estado: 'borrador',
    });

      setModoGuardar(null);
      mostrarToast('Cotización creada con los materiales calculados.', 'success');
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : 'Error al crear la cotización', 'error');
    }
  }

  if (!listo) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <p className="py-16 text-center text-sm text-forge-muted">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-forge-platinum">Optimización de cortes</h1>
        <p className="mt-1 text-sm text-forge-muted">
          Minimiza el desperdicio. Agrega varios materiales sin perder los cálculos anteriores.
        </p>
      </div>

      {/* Selector de material */}
      <Card>
        <label className="mb-1 block text-sm font-medium text-forge-muted">Material activo</label>
        <Select value={materialId} onChange={(e) => seleccionarMaterial(e.target.value)}>
          <option value="">Selecciona un material…</option>
          {materiales.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} — {formatMedida(m.largoBarra)} · {formatCRC(m.precioBarra)}
            </option>
          ))}
        </Select>
        {material && (
          <p className="mt-2 text-sm text-forge-muted">
            Barra de {formatMedida(material.largoBarra)} · {formatCRC(material.precioBarra)}/barra
          </p>
        )}
      </Card>

      {/* Trabajo del material activo */}
      {material ? (
        <>
          <PiezaForm
            key={piezaEditando?.id ?? `nueva-${materialId}`}
            materialId={material.id}
            largoBarra={material.largoBarra}
            kerfDefault={config?.kerfDefault ?? 0.3}
            piezaInicial={piezaEditando}
            onGuardar={guardarPieza}
            onCancelarEdicion={() => setPiezaEditando(null)}
          />

          <ListaPiezas
            piezas={piezasDelMaterial}
            onEliminar={eliminarPieza}
            onEditar={editarPieza}
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={optimizar} disabled={piezasDelMaterial.length === 0}>
              <Scissors className="h-4 w-4" />
              Calcular cortes
            </Button>
          </div>

          {resultadoActual && (
            <VistaBarras resultado={resultadoActual} costoBarra={material.precioBarra} />
          )}
        </>
      ) : (
        <EmptyState
          icono={<Scissors className="h-10 w-10" />}
          titulo="Elige un material"
          descripcion="Selecciona el perfil para empezar a agregar piezas."
        />
      )}

      {/* Resumen multimaterial + acciones */}
      {materialesConPiezas.length > 0 && (
        <Card className="space-y-3">
          <h2 className="font-semibold text-forge-platinum">Materiales del proyecto</h2>

          <ul className="space-y-2">
            {materialesConPiezas.map(({ mat, conteo, resultado }) => (
              <li
                key={mat.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-forge-edge px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-forge-platinum">{mat.nombre}</p>
                  <p className="text-xs text-forge-ghost">{conteo} pieza(s)</p>
                </div>
                {resultado ? (
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-emerald-400">
                      {resultado.totalBarras} {resultado.totalBarras === 1 ? 'barra' : 'barras'}
                    </p>
                    <p className="text-xs text-forge-muted">
                      {formatCRC(resultado.totalBarras * mat.precioBarra)}
                    </p>
                  </div>
                ) : (
                  <span className="shrink-0 rounded bg-amber-900/40 px-2 py-0.5 text-xs text-amber-400">
                    Sin calcular
                  </span>
                )}
              </li>
            ))}
          </ul>

          {hayResultados && (
            <p className="border-t border-forge-edge pt-2 text-right text-sm font-semibold text-forge-platinum">
              Total material: {formatCRC(costoTotalMaterial)}
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModoGuardar('proyecto')}>
              <Save className="h-4 w-4" />
              Guardar proyecto
            </Button>
            {hayResultados && (
              <Button onClick={() => setModoGuardar('cotizacion')}>
                <FileText className="h-4 w-4" />
                Agregar a Cotización
              </Button>
            )}
          </div>
        </Card>
      )}

      {modoGuardar && (
        <GuardarProyecto
          titulo={modoGuardar === 'cotizacion' ? 'Agregar a Cotización' : 'Guardar proyecto'}
          onCerrar={() => setModoGuardar(null)}
          onGuardar={modoGuardar === 'cotizacion' ? agregarACotizacion : guardarProyecto}
        />
      )}
    </div>
  );
}
