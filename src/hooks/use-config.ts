'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import type { ConfiguracionTaller } from '@/types';
import { configRepository } from '@/lib/db/repositories';

export function useConfig() {
  const data = useLiveQuery(() => configRepository.get(), []);
  const config = data ?? null;
  const cargando = data === undefined;

  const guardar = useCallback(async (c: ConfiguracionTaller) => {
    await configRepository.save({ ...c, actualizadoEn: Date.now() });
  }, []);

  return { config, cargando, guardar };
}
