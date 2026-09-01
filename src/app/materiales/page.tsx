'use client';

import { useState } from 'react';
import { MaterialList } from '@/components/materiales/MaterialList';
import { MaterialForm } from '@/components/materiales/MaterialForm';
import { useMateriales, type MaterialInput } from '@/hooks/use-materiales';
import type { Material } from '@/types';

export default function MaterialesPage() {
  const { materiales, cargando, crear, actualizar, eliminar } = useMateriales();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [materialEditar, setMaterialEditar] = useState<Material | null>(null);

  function abrirCrear() {
    setMaterialEditar(null);
    setModalAbierto(true);
  }

  function abrirEditar(m: Material) {
    setMaterialEditar(m);
    setModalAbierto(true);
  }

  async function eliminarMaterial(m: Material) {
    if (window.confirm(`¿Eliminar "${m.nombre}"?`)) {
      await eliminar(m.id);
    }
  }

  async function handleGuardar(input: MaterialInput, id?: string) {
    if (id) await actualizar(id, input);
    else await crear(input);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Materiales</h1>
      <p className="mt-1 text-sm text-slate-500">
        Catálogo de perfiles y costos por barra de 6 m.
      </p>

      <div className="mt-6">
        <MaterialList
          materiales={materiales}
          cargando={cargando}
          onCrear={abrirCrear}
          onEditar={abrirEditar}
          onEliminar={eliminarMaterial}
        />
      </div>

      {modalAbierto && (
        <MaterialForm
          material={materialEditar}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardar}
        />
      )}
    </div>
  );
}
