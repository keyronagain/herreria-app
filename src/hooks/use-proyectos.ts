'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Proyecto } from '@/types';
import { proyectoRepository } from '@/lib/db/repositories';

export type ProyectoInput = Omit<
  Proyecto,
  'id' | 'creadoEn' | 'actualizadoEn'
>;

export function useProyectos() {
  const data = useLiveQuery(() => proyectoRepository.all(), []);
  const proyectos = data ?? [];
  const cargando = data === undefined;

  const crear = useCallback(async (input: ProyectoInput) => {
    await proyectoRepository.create(input);
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Proyecto>) => {
    await proyectoRepository.update(id, changes);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await proyectoRepository.remove(id);
  }, []);

  return { proyectos, cargando, crear, actualizar, eliminar };
}
