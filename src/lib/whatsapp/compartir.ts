import { generarPdfCliente } from '@/lib/pdf/generar-pdf';
import { formatCRC } from '@/lib/utils/format';
import type { Cotizacion, ConfiguracionTaller } from '@/types';

export function mensajeWhatsApp(
  cotizacion: Cotizacion,
  proyectoNombre?: string,
): string {
  const lineas = [`¡Hola ${cotizacion.cliente.nombre}!`];
  lineas.push(
    `Te comparto el resumen de la cotización ${cotizacion.numero} para el proyecto: ${proyectoNombre ?? 'tu proyecto'}.`,
  );
  lineas.push('');

  for (const c of cotizacion.conceptos) {
    const unidad = c.unidad ? ` ${c.unidad}` : '';
    lineas.push(`• ${c.descripcion}: ${c.cantidad}${unidad}`);
  }

  lineas.push('');
  lineas.push(
    `Total estimado: ${formatCRC(cotizacion.totalConIva)} y Vigencia: ${cotizacion.vigenciaDias} días.`,
  );
  lineas.push('');
  lineas.push(
    'Con gusto te puedo enviar el documento PDF formal si lo necesitas. Quedo atento para coordinar el inicio del trabajo.',
  );

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
  proyectoNombre?: string,
): Promise<void> {
  const doc = await generarPdfCliente(cotizacion, config);
  const blob = doc.output('blob');
  const archivo = new File([blob], `cotizacion-${cotizacion.numero}.pdf`, {
    type: 'application/pdf',
  });
  const texto = mensajeWhatsApp(cotizacion, proyectoNombre);

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
