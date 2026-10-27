import type {
  ResultadoOptimizacion,
  PatronBarra,
} from '@/types';

export interface PiezaCorte {
  id: string;
  descripcion: string;
  cantidad: number;
  largo: number;
  kerf: number;
}

interface CorteIndividual {
  id: string;
  descripcion: string;
  largo: number;
  tramo?: number;
  tramosTotal?: number;
}

export function requiereEmpate(largo: number, largoBarra: number): boolean {
  return largoBarra > 0 && largo > largoBarra;
}

export function dividirEnTramos(largo: number, largoBarra: number): number[] {
  if (!requiereEmpate(largo, largoBarra)) return [largo];

  const tramos: number[] = [];
  let resto = largo;
  while (resto > largoBarra) {
    tramos.push(largoBarra);
    resto = redondear(resto - largoBarra);
  }
  tramos.push(resto);
  return tramos;
}

export function optimizarCortes(
  piezas: readonly PiezaCorte[],
  largoBarra: number,
  materialId: string,
): ResultadoOptimizacion {
  const individuales: CorteIndividual[] = [];
  let totalPiezas = 0;
  let empates = 0;

  for (const p of piezas) {
    const tramos = dividirEnTramos(p.largo, largoBarra);
    for (let i = 0; i < p.cantidad; i++) {
      totalPiezas++;
      empates += tramos.length - 1;
      tramos.forEach((tramo, t) => {
        const dividida = tramos.length > 1;
        individuales.push({
          id: p.id,
          descripcion: dividida
            ? `${p.descripcion} (tramo ${t + 1}/${tramos.length})`
            : p.descripcion,
          largo: Math.min(redondear(tramo + p.kerf), largoBarra),
          ...(dividida && { tramo: t + 1, tramosTotal: tramos.length }),
        });
      });
    }
  }

  const ordenados = individuales.sort((a, b) => b.largo - a.largo);

  const patrones: PatronBarra[] = [];
  for (const corte of ordenados) {
    let barra = patrones.find((b) => b.sobrante >= corte.largo);
    if (!barra) {
      barra = {
        materialId,
        largoBarra,
        cortes: [],
        sobrante: largoBarra,
        utilizacionPct: 0,
      };
      patrones.push(barra);
    }
    barra.cortes.push({
      piezaId: corte.id,
      largo: corte.largo,
      descripcion: corte.descripcion,
      ...(corte.tramo && { tramo: corte.tramo, tramosTotal: corte.tramosTotal }),
    });
    barra.sobrante = redondear(barra.sobrante - corte.largo);
  }

  let sobranteTotal = 0;
  let usadoTotal = 0;
  for (const b of patrones) {
    const usado = b.cortes.reduce((s, c) => s + c.largo, 0);
    b.utilizacionPct = redondear1((usado / b.largoBarra) * 100);
    sobranteTotal += b.sobrante;
    usadoTotal += usado;
  }

  const capacidadTotal = patrones.length * largoBarra;
  const utilizacionPct = capacidadTotal
    ? redondear1((usadoTotal / capacidadTotal) * 100)
    : 0;

  return {
    materialId,
    totalPiezas,
    totalBarras: patrones.length,
    patrones,
    sobranteTotal: redondear(sobranteTotal),
    utilizacionPct,
    ...(empates > 0 && { empates }),
  };
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function redondear1(n: number): number {
  return Math.round(n * 10) / 10;
}
