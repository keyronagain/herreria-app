'use client';

import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Table, THead, TBody, Th, Td } from '@/components/ui/Table';
import { useUIStore } from '@/stores/ui-store';
import { formatMedida } from '@/lib/utils/format';
import type { Proyecto, Material } from '@/types';

interface Props {
  proyecto: Proyecto;
  materiales: Material[];
  onCerrar: () => void;
}

export function ProyectoDetalle({ proyecto, materiales, onCerrar }: Props) {
  const router = useRouter();
  const setProyectoIdParaCotizar = useUIStore(
    (s) => s.setProyectoIdParaCotizar,
  );

  function nombreMaterial(materialId: string): string {
    return materiales.find((m) => m.id === materialId)?.nombre ?? 'Material';
  }

  function crearCotizacion() {
    setProyectoIdParaCotizar(proyecto.id);
    router.push('/cotizaciones');
  }

  return (
    <Modal abierto onCerrar={onCerrar} titulo={proyecto.nombre}>
      <div className="space-y-4">
        {proyecto.cliente && (
          <p className="text-sm text-slate-500">Cliente: {proyecto.cliente}</p>
        )}

        {proyecto.piezas.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Este proyecto no tiene piezas.
          </p>
        ) : (
          <Table>
            <THead>
              <Th>Material</Th>
              <Th>Descripción</Th>
              <Th className="text-right">Largo</Th>
              <Th className="text-right">Cant.</Th>
              <Th className="text-right">Kerf</Th>
            </THead>
            <TBody>
              {proyecto.piezas.map((p) => (
                <tr key={p.id}>
                  <Td>{nombreMaterial(p.materialId)}</Td>
                  <Td>{p.descripcion}</Td>
                  <Td className="text-right">{formatMedida(p.largo)}</Td>
                  <Td className="text-right">{p.cantidad}</Td>
                  <Td className="text-right">{p.kerf} cm</Td>
                </tr>
              ))}
            </TBody>
          </Table>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>
            Cerrar
          </Button>
          <Button type="button" onClick={crearCotizacion}>
            <FileText className="h-4 w-4" />
            Crear cotización
          </Button>
        </div>
      </div>
    </Modal>
  );
}
