import type { jsPDF } from 'jspdf';
import type { CellHookData } from 'jspdf-autotable';
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

const ROJO: [number, number, number] = [231, 27, 35]; // #E31B23
const CARBON: [number, number, number] = [45, 45, 45]; // #2D2D2D
const METAL: [number, number, number] = [209, 209, 209]; // #D1D1D1
const PLATINO: [number, number, number] = [244, 244, 244]; // #F4F4F4
const BLANCO: [number, number, number] = [255, 255, 255];

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

function parseLogo(dataUrl: string): { formato: string; data: string } | null {
  const match = /^data:image\/(png|jpe?g|svg\+xml);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const mime = match[1];
  const formato =
    mime === 'png' ? 'PNG' : mime === 'jpeg' || mime === 'jpg' ? 'JPEG' : 'SVG';
  return { formato, data: dataUrl };
}

function dibujarHeader(
  doc: jsPDF,
  config: ConfiguracionTaller,
  titulo: string,
  cotizacion: Cotizacion,
): number {
  const ancho = doc.internal.pageSize.getWidth();

  if (config.logoBase64) {
    const parsed = parseLogo(config.logoBase64);
    if (parsed) {
      try {
        const props = doc.getImageProperties(parsed.data);
        const alto = 16;
        const anchoLogo = (props.width / props.height) * alto;
        doc.addImage(parsed.data, parsed.formato, MARGEN, 12, anchoLogo, alto);
      } catch {
        // sin logo
      }
    }
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(config.nombreTaller, MARGEN, 20);
  }

  const x = ancho - MARGEN;
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(titulo, x, y, { align: 'right' });
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`N°: ${cotizacion.numero}`, x, y, { align: 'right' });
  y += 5;
  doc.text(
    `Fecha: ${new Date(cotizacion.fecha).toLocaleDateString('es-CR')}`,
    x,
    y,
    { align: 'right' },
  );
  y += 5;
  doc.text(`Vigencia: ${cotizacion.vigenciaDias} días`, x, y, {
    align: 'right',
  });
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Cliente', x, y, { align: 'right' });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(cotizacion.cliente.nombre, x, y, { align: 'right' });
  y += 5;
  if (cotizacion.cliente.telefono) {
    doc.text(cotizacion.cliente.telefono, x, y, { align: 'right' });
    y += 5;
  }
  if (cotizacion.cliente.direccion) {
    doc.text(cotizacion.cliente.direccion, x, y, { align: 'right' });
    y += 5;
  }

  return y + 6;
}

async function construirBase(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
): Promise<{ doc: jsPDF; autoTable: AutoTable }> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const ancho = doc.internal.pageSize.getWidth();

  const yInicio = dibujarHeader(doc, config, 'Cotización', cotizacion);

  autoTable(doc, {
    startY: yInicio,
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
    styles: { fontSize: 9, cellPadding: 2, textColor: CARBON, lineColor: METAL },
    headStyles: {
      fillColor: ROJO,
      textColor: BLANCO,
      fontStyle: 'bold',
    },
  });

  const filasResumen: {
    label: string;
    valor: string;
    esTotal: boolean;
    esSubtotal: boolean;
  }[] = [
    {
      label: 'Subtotal',
      valor: crc(cotizacion.subtotal),
      esTotal: false,
      esSubtotal: true,
    },
    {
      label: `Ganancia (${cotizacion.pctGanancia}%)`,
      valor: crc(cotizacion.ganancia),
      esTotal: false,
      esSubtotal: false,
    },
  ];
  if (cotizacion.aplicarIva) {
    filasResumen.push({
      label: `IVA (${cotizacion.ivaPct}%)`,
      valor: crc(cotizacion.totalConIva - cotizacion.total),
      esTotal: false,
      esSubtotal: false,
    });
  }
  filasResumen.push({
    label: 'Total',
    valor: crc(cotizacion.totalConIva),
    esTotal: true,
    esSubtotal: false,
  });

  autoTable(doc, {
    startY: finalY(doc) + 6,
    body: filasResumen.map((f) => [f.label, f.valor]),
    margin: { left: ancho * 0.6, right: MARGEN },
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 2.5,
      textColor: CARBON,
      lineColor: METAL,
    },
    columnStyles: { 1: { halign: 'right' } },
    didParseCell: (data: CellHookData) => {
      if (data.section !== 'body') return;
      const fila = filasResumen[data.row.index];
      if (!fila) return;
      if (fila.esSubtotal || fila.esTotal) {
        data.cell.styles.fillColor = PLATINO;
      }
      if (fila.esTotal) {
        data.cell.styles.textColor = ROJO;
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  let y = finalY(doc) + 8;

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
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
  piezas: PiezaRequerida[],
  patrones: ResultadoOptimizacion[],
  materiales: Material[],
) {
  let y = dibujarHeader(doc, config, 'Ficha de taller', cotizacion);

  if (piezas.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Lista de piezas', MARGEN, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Descripción', 'Largo (cm)', 'Cantidad']],
      body: piezas.map((p) => [p.descripcion, cmTexto(p.largo), String(p.cantidad)]),
      margin: { left: MARGEN, right: MARGEN },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 1, textColor: CARBON, lineColor: METAL },
      headStyles: { fillColor: ROJO, textColor: BLANCO, fontStyle: 'bold' },
    });

    y = finalY(doc) + 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Plan de corte por barra', MARGEN, y);
  y += 4;

  for (const p of patrones) {
    const nombre = nombreMaterial(p.materialId, materiales);
    doc.setFont('helvetica', 'normal');
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
      styles: { fontSize: 8, cellPadding: 1, textColor: CARBON, lineColor: METAL },
      headStyles: { fillColor: ROJO, textColor: BLANCO, fontStyle: 'bold' },
    });

    y = finalY(doc) + 8;
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
    dibujarFichaTaller(
      doc,
      autoTable,
      cotizacion,
      config,
      piezas,
      patrones,
      materiales,
    );
  } else {
    const y = dibujarHeader(doc, config, 'Ficha de taller', cotizacion);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(
      'Cotización manual sin proyecto de corte vinculado.',
      MARGEN,
      y,
    );
  }

  return doc;
}
