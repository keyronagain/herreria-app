'use client';

import { useState } from 'react';
import { Share2, ClipboardList, MessageCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, Th, Td } from '@/components/ui/Table';
import { generarPdfTaller } from '@/lib/pdf/generar-pdf';
import {
  mensajeWhatsApp,
  abrirWhatsApp,
  compartirPdf,
} from '@/lib/whatsapp/compartir';
import { formatCRC } from '@/lib/utils/format';
import { useUIStore } from '@/stores/ui-store';
import type {
  Cotizacion,
  ConfiguracionTaller,
  Material,
  Proyecto,
} from '@/types';

interface Props {
  cotizacion: Cotizacion;
  config: ConfiguracionTaller;
  materiales: Material[];
  proyectos: Proyecto[];
  onCerrar: () => void;
}

export function CotizacionDetalle({
  cotizacion,
  config,
  materiales,
  proyectos,
  onCerrar,
}: Props) {
  const [ocupado, setOcupado] = useState(false);
  const mostrarToast = useUIStore((s) => s.mostrarToast);

  function enviarWhatsApp() {
    const proyecto = proyectos.find((p) => p.id === cotizacion.proyectoId);
    abrirWhatsApp(mensajeWhatsApp(cotizacion, proyecto?.nombre));
    mostrarToast('Mensaje listo para enviar.', 'success');
  }

  async function compartirDocumento() {
    setOcupado(true);
    try {
      const proyecto = proyectos.find((p) => p.id === cotizacion.proyectoId);
      await compartirPdf(cotizacion, config, proyecto?.nombre);
    } finally {
      setOcupado(false);
    }
  }

  async function pdfTaller() {
    setOcupado(true);
    try {
      const proyecto =
        proyectos.find((p) => p.id === cotizacion.proyectoId) ?? null;
      const doc = await generarPdfTaller(
        cotizacion,
        config,
        materiales,
        proyecto,
      );
      doc.save(`cotizacion-${cotizacion.numero}-taller.pdf`);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <Modal
      abierto
      onCerrar={onCerrar}
      titulo={`Cotización ${cotizacion.numero}`}
      className="sm:max-w-2xl"
    >
      <div className="space-y-4">
        <div className="text-sm text-slate-400">
          <p>Cliente: {cotizacion.cliente.nombre}</p>
          {cotizacion.cliente.telefono && (
            <p>Teléfono: {cotizacion.cliente.telefono}</p>
          )}
          <p>
            Fecha: {new Date(cotizacion.fecha).toLocaleDateString('es-CR')} ·
            Vigencia: {cotizacion.vigenciaDias} días
          </p>
        </div>

        <Table>
          <THead>
            <Th>Concepto</Th>
            <Th className="text-right">Cant.</Th>
            <Th className="text-right">Subtotal</Th>
          </THead>
          <TBody>
            {cotizacion.conceptos.map((c) => (
              <tr key={c.id}>
                <Td>{c.descripcion}</Td>
                <Td className="text-right">
                  {c.cantidad} {c.unidad ?? ''}
                </Td>
                <Td className="text-right">{formatCRC(c.subtotal)}</Td>
              </tr>
            ))}
          </TBody>
        </Table>

        <div className="space-y-1 rounded-2xl border border-slate-700 bg-slate-800 p-4 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span>{formatCRC(cotizacion.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Ganancia ({cotizacion.pctGanancia}%)</span>
            <span>{formatCRC(cotizacion.ganancia)}</span>
          </div>
          {cotizacion.aplicarIva && (
            <div className="flex justify-between text-slate-400">
              <span>IVA ({cotizacion.ivaPct}%)</span>
              <span>
                {formatCRC(cotizacion.totalConIva - cotizacion.total)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-700 pt-2 font-bold text-slate-100">
            <span>Total</span>
            <span>{formatCRC(cotizacion.totalConIva)}</span>
          </div>
        </div>

        {cotizacion.notas && (
          <p className="text-sm text-slate-400">Notas: {cotizacion.notas}</p>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button onClick={enviarWhatsApp}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button
            variant="secondary"
            onClick={compartirDocumento}
            disabled={ocupado}
          >
            <Share2 className="h-4 w-4" /> Compartir PDF
          </Button>
          <Button variant="secondary" onClick={pdfTaller} disabled={ocupado}>
            <ClipboardList className="h-4 w-4" /> PDF Taller
          </Button>
        </div>
      </div>
    </Modal>
  );
}
