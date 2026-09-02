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

export function optimizarCortes(
  piezas: readonly PiezaCorte[],
  largoBarra: number,
  materialId: string,
): ResultadoOptimizacion {
  const individuales: { id: string; descripcion: string; largo: number }[] = [];

  for (const p of piezas) {
    for (let i = 0; i < p.cantidad; i++) {
      individuales.push({
        id: p.id,
        descripcion: p.descripcion,
        largo: redondear(p.largo + p.kerf),
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
    totalPiezas: individuales.length,
    totalBarras: patrones.length,
    patrones,
    sobranteTotal: redondear(sobranteTotal),
    utilizacionPct,
  };
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

function redondear1(n: number): number {
  return Math.round(n * 10) / 10;
}
