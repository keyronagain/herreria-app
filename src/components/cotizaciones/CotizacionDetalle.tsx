'use client';

import { useState } from 'react';
import { FileText, ClipboardList, MessageCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, Th, Td } from '@/components/ui/Table';
import { generarPdfCliente, generarPdfTaller } from '@/lib/pdf/generar-pdf';
import { compartirCotizacion } from '@/lib/whatsapp/compartir';
import { formatCRC } from '@/lib/utils/format';
import type { Cotizacion, ConfiguracionTaller, Material } from '@/types';

interface Props {
  cotizacion: Cotizacion;
  config: ConfiguracionTaller;
  materiales: Material[];
  onCerrar: () => void;
}

export function CotizacionDetalle({
  cotizacion,
  config,
  materiales,
  onCerrar,
}: Props) {
  const [ocupado, setOcupado] = useState(false);

  async function pdfCliente() {
    setOcupado(true);
    try {
      const doc = await generarPdfCliente(cotizacion, config);
      doc.save(`cotizacion-${cotizacion.numero}.pdf`);
    } finally {
      setOcupado(false);
    }
  }

  async function pdfTaller() {
    setOcupado(true);
    try {
      const doc = await generarPdfTaller(cotizacion, config, materiales);
      doc.save(`cotizacion-${cotizacion.numero}-taller.pdf`);
    } finally {
      setOcupado(false);
    }
  }

  async function compartir() {
    setOcupado(true);
    try {
      await compartirCotizacion(cotizacion, config);
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
        <div className="text-sm text-slate-500">
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

        <div className="space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCRC(cotizacion.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Ganancia ({cotizacion.pctGanancia}%)</span>
            <span>{formatCRC(cotizacion.ganancia)}</span>
          </div>
          {cotizacion.aplicarIva && (
            <div className="flex justify-between text-slate-600">
              <span>IVA ({cotizacion.ivaPct}%)</span>
              <span>
                {formatCRC(cotizacion.totalConIva - cotizacion.total)}
              </span>
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
            <span>Total</span>
            <span>{formatCRC(cotizacion.totalConIva)}</span>
          </div>
        </div>

        {cotizacion.notas && (
          <p className="text-sm text-slate-500">Notas: {cotizacion.notas}</p>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button variant="secondary" onClick={pdfCliente} disabled={ocupado}>
            <FileText className="h-4 w-4" /> PDF Cliente
          </Button>
          <Button variant="secondary" onClick={pdfTaller} disabled={ocupado}>
            <ClipboardList className="h-4 w-4" /> PDF Taller
          </Button>
          <Button onClick={compartir} disabled={ocupado}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </div>
      </div>
    </Modal>
  );
}
