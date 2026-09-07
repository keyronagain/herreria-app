import { generarPdfCliente } from '@/lib/pdf/generar-pdf';
import { formatCRC } from '@/lib/utils/format';
import type { Cotizacion, ConfiguracionTaller } from '@/types';

export function mensajeWhatsApp(
  cotizacion: Cotizacion,
  proyectoNombre?: string,
): string {
  const lineas = [`¡Hola ${cotizacion.cliente.nombre}!`];
  lineas.push('Te comparto la cotización de tu proyecto:');
  lineas.push('');
  if (proyectoNombre) lineas.push(`• Proyecto: ${proyectoNombre}`);
  lineas.push(`• N°: ${cotizacion.numero}`);
  lineas.push(`• Total: ${formatCRC(cotizacion.totalConIva)}`);
  lineas.push(`• Vigencia: ${cotizacion.vigenciaDias} días`);
  return lineas.join('\n');
}

export function abrirWhatsApp(texto: string): void {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(texto)}`,
    '_blank',
    'noopener,noreferrer',
  );
}

function descargar(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function compartirPdf(
  cotizacion: Cotizacion,
  config: ConfiguracionTaller,
): Promise<void> {
  const doc = await generarPdfCliente(cotizacion, config);
  const blob = doc.output('blob');
  const archivo = new File([blob], `cotizacion-${cotizacion.numero}.pdf`, {
    type: 'application/pdf',
  });
  const texto = mensajeWhatsApp(cotizacion);

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
}
