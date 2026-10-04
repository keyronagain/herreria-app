'use client';

import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  titulo?: string;
  onCerrar: () => void;
  onGuardar: (nombre: string, cliente: string) => Promise<void>;
}

export function GuardarProyecto({ titulo = 'Guardar proyecto', onCerrar, onGuardar }: Props) {
  const [nombre, setNombre] = useState('');
  const [cliente, setCliente] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setGuardando(true);
    try {
      await onGuardar(nombre.trim(), cliente.trim());
      setNombre('');
      setCliente('');
      onCerrar();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal abierto onCerrar={onCerrar} titulo={titulo}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Nombre del proyecto
          </label>
          <Input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Portón de entrada"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Cliente
          </label>
          <Input
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Opcional"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
