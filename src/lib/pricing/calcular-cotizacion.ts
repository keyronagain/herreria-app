import { optimizarCortes } from '@/lib/cutting/optimizar';
import { uid } from '@/lib/utils/id';
import type {
  PiezaRequerida,
  Material,
  ConfiguracionTaller,
  ConceptoCosto,
  ModoManoObra,
  ModoConsumo,
  ResultadoOptimizacion,
} from '@/types';

export function generarConceptos(
  piezas: PiezaRequerida[],
  materiales: Material[],
  config: ConfiguracionTaller,
  horasManoObra: number,
): ConceptoCosto[] {
  const conceptos: ConceptoCosto[] = [];

  const porMaterial = new Map<string, PiezaRequerida[]>();
  for (const p of piezas) {
    const lista = porMaterial.get(p.materialId) ?? [];
    lista.push(p);
    porMaterial.set(p.materialId, lista);
  }

  for (const [materialId, piezasMaterial] of porMaterial) {
    const material = materiales.find((m) => m.id === materialId);
    const resultado = optimizarCortes(
      piezasMaterial,
      material?.largoBarra ?? config.largoBarraDefault,
      materialId,
    );
    const subtotal = resultado.totalBarras * (material?.precioBarra ?? 0);
    conceptos.push({
      id: uid(),
      descripcion: material?.nombre ?? 'Material',
      tipo: 'material',
      cantidad: resultado.totalBarras,
      unidad: 'barra',
      costoUnitario: material?.precioBarra ?? 0,
      subtotal: redondear2(subtotal),
    });
  }

  const totalPiezas = piezas.reduce((s, p) => s + p.cantidad, 0);
  const metrosLineales = piezas.reduce(
    (s, p) => s + (p.largo * p.cantidad) / 100,
    0,
  );

  for (const insumo of config.insumos) {
    const cantidad = cantidadInsumo(insumo.modoConsumo, insumo.factor, {
      metrosLineales,
      totalPiezas,
      horas: horasManoObra,
    });
    const subtotal = redondear2(cantidad * insumo.costoUnitario);
    conceptos.push({
      id: uid(),
      descripcion: insumo.nombre,
      tipo: 'insumo',
      cantidad: redondear3(cantidad),
      unidad: insumo.unidad,
      costoUnitario: insumo.costoUnitario,
      subtotal,
    });
  }

  return conceptos;
}

export function generarPatrones(
  piezas: PiezaRequerida[],
  materiales: Material[],
  config: ConfiguracionTaller,
): ResultadoOptimizacion[] {
  const porMaterial = new Map<string, PiezaRequerida[]>();
  for (const p of piezas) {
    const lista = porMaterial.get(p.materialId) ?? [];
    lista.push(p);
    porMaterial.set(p.materialId, lista);
  }

  const resultados: ResultadoOptimizacion[] = [];
  for (const [materialId, piezasMaterial] of porMaterial) {
    const material = materiales.find((m) => m.id === materialId);
    resultados.push(
      optimizarCortes(
        piezasMaterial,
        material?.largoBarra ?? config.largoBarraDefault,
        materialId,
      ),
    );
  }
  return resultados;
}

function cantidadInsumo(
  modo: ModoConsumo,
  factor: number,
  ctx: { metrosLineales: number; totalPiezas: number; horas: number },
): number {
  switch (modo) {
    case 'metro_lineal':
      return factor * ctx.metrosLineales;
    case 'por_pieza':
      return factor * ctx.totalPiezas;
    case 'por_hora':
      return factor * ctx.horas;
    case 'por_kg':
      return 0;
    default:
      return 0;
  }
}

export function calcularManoObra(
  modo: ModoManoObra,
  manoObraFijo: number,
  horasManoObra: number,
  pctManoObra: number,
  costoMaterial: number,
  config: ConfiguracionTaller,
): number {
  if (modo === 'fijo') return redondear2(manoObraFijo);
  if (modo === 'horas') {
    return redondear2(config.costoManoObraHora * horasManoObra);
  }
  return redondear2((pctManoObra / 100) * costoMaterial);
}

export function resumenPorTipo(conceptos: ConceptoCosto[]): {
  costoMaterial: number;
  costoInsumos: number;
} {
  return {
    costoMaterial: redondear2(
      conceptos
        .filter((c) => c.tipo === 'material')
        .reduce((s, c) => s + c.subtotal, 0),
    ),
    costoInsumos: redondear2(
      conceptos
        .filter((c) => c.tipo === 'insumo')
        .reduce((s, c) => s + c.subtotal, 0),
    ),
  };
}

export interface Totales {
  subtotal: number;
  ganancia: number;
  total: number;
  iva: number;
  totalConIva: number;
}

export function recalcularTotales(
  conceptos: ConceptoCosto[],
  costoManoObra: number,
  pctGanancia: number,
  ivaPct: number,
  aplicarIva: boolean,
): Totales {
  const subtotal = redondear2(
    conceptos.reduce((s, c) => s + c.subtotal, 0) + costoManoObra,
  );
  const ganancia = redondear2((pctGanancia / 100) * subtotal);
  const total = redondear2(subtotal + ganancia);
  const iva = aplicarIva ? redondear2((ivaPct / 100) * total) : 0;
  const totalConIva = redondear2(total + iva);

  return { subtotal, ganancia, total, iva, totalConIva };
}

function redondear2(n: number): number {
  return Math.round(n * 100) / 100;
}

function redondear3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
