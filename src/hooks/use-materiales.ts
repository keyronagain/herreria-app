'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Material } from '@/types';
import { materialRepository } from '@/lib/db/repositories';

export type MaterialInput = Omit<
  Material,
  'id' | 'creadoEn' | 'actualizadoEn'
>;

export function useMateriales() {
  const data = useLiveQuery(() => materialRepository.all(), []);
  const materiales = data ?? [];
  const cargando = data === undefined;

  const crear = useCallback(async (input: MaterialInput) => {
    await materialRepository.create(input);
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Material>) => {
    await materialRepository.update(id, changes);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await materialRepository.remove(id);
  }, []);

  return { materiales, cargando, crear, actualizar, eliminar };
}
