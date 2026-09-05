import { generarPdfCliente } from '@/lib/pdf/generar-pdf';
import type { Cotizacion, ConfiguracionTaller } from '@/types';

function resumenTexto(cotizacion: Cotizacion): string {
  const crc = (n: number) =>
    new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(
      Math.round(n),
    );
  const lineas = [
    `*Cotización ${cotizacion.numero}*`,
    `Cliente: ${cotizacion.cliente.nombre}`,
  ];
  for (const c of cotizacion.conceptos) {
    lineas.push(`• ${c.descripcion}: ${crc(c.subtotal)}`);
  }
  lineas.push(`*Total: ${crc(cotizacion.totalConIva)}*`);
  return lineas.join('\n');
}

function descargar(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function compartirCotizacion(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
): Promise<void> {
  const doc = await generarPdfCliente(cotizacion, config);
  const blob = doc.output('blob');
  const archivo = new File(
    [blob],
    `cotizacion-${cotizacion.numero}.pdf`,
    { type: 'application/pdf' },
  );
  const texto = resumenTexto(cotizacion);

  if (
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [archivo] })
  ) {
    try {
      await navigator.share({
        files: [archivo],
        title: `Cotización ${cotizacion.numero}`,
        text: texto,
      });
      return;
    } catch {
      // cancelado o no soportado; continuar al fallback
    }
  }

  descargar(blob, `cotizacion-${cotizacion.numero}.pdf`);
  window.open(
    `https://wa.me/?text=${encodeURIComponent(texto)}`,
    '_blank',
    'noopener,noreferrer',
  );
}
