import type { jsPDF } from 'jspdf';
import type {
  Cotizacion,
  ConfiguracionTaller,
  Material,
  Proyecto,
  PiezaRequerida,
  ResultadoOptimizacion,
} from '@/types';
import { generarPatrones } from '@/lib/pricing/calcular-cotizacion';

type AutoTable = (doc: jsPDF, options: Record<string, unknown>) => void;

const MARGEN = 15;

function crc(n: number): string {
  return new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(
    Math.round(n),
  );
}

function cmTexto(n: number): string {
  return `${Math.round(n * 10) / 10} cm`;
}

function nombreMaterial(materialId: string, materiales: Material[]): string {
  return materiales.find((m) => m.id === materialId)?.nombre ?? 'Material';
}

function finalY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
}

async function construirBase(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
): Promise<{ doc: jsPDF; autoTable: AutoTable }> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ancho = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(config.nombreTaller, MARGEN, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Cotización', MARGEN, 27);

  doc.setFontSize(9);
  doc.text(`N°: ${cotizacion.numero}`, MARGEN, 35);
  doc.text(
    `Fecha: ${new Date(cotizacion.fecha).toLocaleDateString('es-CR')}`,
    MARGEN,
    40,
  );
  doc.text(`Vigencia: ${cotizacion.vigenciaDias} días`, MARGEN, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente', MARGEN, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(cotizacion.cliente.nombre, MARGEN, 60);
  let yCliente = 65;
  if (cotizacion.cliente.telefono) {
    doc.text(`Teléfono: ${cotizacion.cliente.telefono}`, MARGEN, yCliente);
    yCliente += 5;
  }
  if (cotizacion.cliente.direccion) {
    doc.text(`Dirección: ${cotizacion.cliente.direccion}`, MARGEN, yCliente);
    yCliente += 5;
  }

  autoTable(doc, {
    startY: yCliente + 4,
    head: [['Descripción', 'Cant.', 'Unidad', 'Costo unit.', 'Subtotal']],
    body: cotizacion.conceptos.map((c) => [
      c.descripcion,
      String(c.cantidad),
      c.unidad ?? '',
      crc(c.costoUnitario),
      crc(c.subtotal),
    ]),
    margin: { left: MARGEN, right: MARGEN },
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: {
      fillColor: [245, 158, 11],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
    },
  });

  let y = finalY(doc) + 8;

  const lineas: [string, string][] = [
    ['Subtotal', crc(cotizacion.subtotal)],
    [`Ganancia (${cotizacion.pctGanancia}%)`, crc(cotizacion.ganancia)],
  ];
  if (cotizacion.aplicarIva) {
    lineas.push([
      `IVA (${cotizacion.ivaPct}%)`,
      crc(cotizacion.totalConIva - cotizacion.total),
    ]);
  }
  lineas.push(['Total', crc(cotizacion.totalConIva)]);

  doc.setFontSize(10);
  for (const [label, valor] of lineas) {
    const esTotal = label === 'Total';
    if (esTotal) doc.setFont('helvetica', 'bold');
    doc.text(label, MARGEN, y);
    doc.text(valor, ancho - MARGEN, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    y += 6;
  }

  if (cotizacion.notas) {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Notas', MARGEN, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(
      doc.splitTextToSize(cotizacion.notas, ancho - MARGEN * 2),
      MARGEN,
      y,
    );
  }

  doc.setFontSize(8);
  doc.text('Montos en colones costarricenses (CRC).', MARGEN, 285);
  doc.text(`Cotización válida por ${cotizacion.vigenciaDias} días.`, MARGEN, 290);

  return { doc, autoTable };
}

function dibujarFichaTaller(
  doc: jsPDF,
  autoTable: AutoTable,
  piezas: PiezaRequerida[],
  patrones: ResultadoOptimizacion[],
  materiales: Material[],
) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Ficha de taller', MARGEN, 20);

  let y = 28;

  if (piezas.length > 0) {
    doc.setFontSize(11);
    doc.text('Lista de piezas', MARGEN, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Descripción', 'Largo (cm)', 'Cantidad']],
      body: piezas.map((p) => [p.descripcion, cmTexto(p.largo), String(p.cantidad)]),
      margin: { left: MARGEN, right: MARGEN },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    });

    y = finalY(doc) + 10;
  }

  doc.setFontSize(11);
  doc.text('Plan de corte por barra', MARGEN, y);
  y += 4;

  for (const p of patrones) {
    const nombre = nombreMaterial(p.materialId, materiales);
    doc.setFontSize(10);
    doc.text(
      `${nombre} — ${p.totalBarras} barra(s) · sobrante ${cmTexto(p.sobranteTotal)} · uso ${p.utilizacionPct}%`,
      MARGEN,
      y,
    );
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Barra', 'Cortes', 'Sobrante', 'Uso']],
      body: p.patrones.map((b, i) => [
        `#${i + 1}`,
        b.cortes.map((c) => `${c.descripcion} (${cmTexto(c.largo)})`).join('\n'),
        cmTexto(b.sobrante),
        `${b.utilizacionPct}%`,
      ]),
      margin: { left: MARGEN, right: MARGEN },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    });

    y = finalY(doc) + 10;
  }
}

export async function generarPdfCliente(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
): Promise<jsPDF> {
  const { doc } = await construirBase(cotizacion, config);
  return doc;
}

export async function generarPdfTaller(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
  materiales: Material[],
  proyecto?: Proyecto | null,
): Promise<jsPDF> {
  const { doc, autoTable } = await construirBase(cotizacion, config);

  const piezas = proyecto?.piezas ?? [];
  let patrones = cotizacion.patrones ?? [];
  if (piezas.length > 0) {
    patrones = generarPatrones(piezas, materiales, config);
  }

  doc.addPage();

  if (patrones.length > 0 || piezas.length > 0) {
    dibujarFichaTaller(doc, autoTable, piezas, patrones, materiales);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(
      'Cotización manual sin proyecto de corte vinculado.',
      MARGEN,
      28,
    );
  }

  return doc;
}
