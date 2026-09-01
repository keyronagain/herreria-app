'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Cotizacion } from '@/types';
import { cotizacionRepository } from '@/lib/db/repositories';

export type CotizacionInput = Omit<
  Cotizacion,
  'id' | 'creadoEn' | 'actualizadoEn'
>;

export function useCotizaciones() {
  const data = useLiveQuery(() => cotizacionRepository.all(), []);
  const cotizaciones = data ?? [];
  const cargando = data === undefined;

  const crear = useCallback(async (input: CotizacionInput) => {
    await cotizacionRepository.create(input);
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Cotizacion>) => {
    await cotizacionRepository.update(id, changes);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    await cotizacionRepository.remove(id);
  }, []);

  return { cotizaciones, cargando, crear, actualizar, eliminar };
}
