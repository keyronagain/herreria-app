'use client';

import { useState } from 'react';
import { MaterialList } from '@/components/materiales/MaterialList';
import { MaterialForm } from '@/components/materiales/MaterialForm';
import { useMateriales, type MaterialInput } from '@/hooks/use-materiales';
import { useUIStore } from '@/stores/ui-store';
import { mensajeSupabase } from '@/lib/utils/error';
import type { Material } from '@/types';

export default function MaterialesPage() {
  const { materiales, cargando, crear, actualizar, eliminar, restablecerCatalogo } = useMateriales();
  const mostrarToast = useUIStore((s) => s.mostrarToast);
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
      try {
        await eliminar(m.id);
        mostrarToast('Material eliminado.', 'success');
      } catch (err) {
        mostrarToast(mensajeSupabase(err), 'error');
      }
    }
  }

  async function handleRestablecer() {
    if (!window.confirm('¿Reemplazar TODOS los materiales con el catálogo del proveedor? Esta acción no se puede deshacer.')) return;
    try {
      await restablecerCatalogo();
      mostrarToast('Catálogo restablecido con 26 materiales.', 'success');
    } catch (err) {
      mostrarToast(mensajeSupabase(err), 'error');
    }
  }

  async function handleGuardar(input: MaterialInput, id?: string) {
    try {
      if (id) {
        await actualizar(id, input);
        mostrarToast('Material actualizado correctamente.', 'success');
      } else {
        await crear(input);
        mostrarToast('Material creado.', 'success');
      }
    } catch (err) {
      mostrarToast(mensajeSupabase(err), 'error');
      throw err; // re-throw para que MaterialForm no cierre el modal
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-bold text-forge-platinum">Materiales</h1>
      <p className="mt-1 text-sm text-forge-muted">
        Catálogo de perfiles y costos por barra de 6 m.
      </p>

      <div className="mt-6">
        <MaterialList
          materiales={materiales}
          cargando={cargando}
          onCrear={abrirCrear}
          onEditar={abrirEditar}
          onEliminar={eliminarMaterial}
          onRestablecer={handleRestablecer}
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
