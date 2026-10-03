'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { seedConfigIfEmpty } from '@/data/seed';
import type { ConfiguracionTaller } from '@/types';

export function useConfig() {
  const [config, setConfig] = useState<ConfiguracionTaller | null>(null);
  const [cargando, setCargando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    async function cargar() {
      const { data } = await sb!
        .from('configuracion')
        .select('*')
        .eq('id', 'taller')
        .maybeSingle();
      if (data) {
        setConfig(data as ConfiguracionTaller);
      } else {
        const seeded = await seedConfigIfEmpty(sb!);
        if (seeded) setConfig(seeded);
      }
      setCargando(false);
    }

    void cargar();

    const channel = sb
      .channel('configuracion-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setConfig(null);
        } else {
          setConfig(payload.new as ConfiguracionTaller);
        }
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const guardar = useCallback(async (c: ConfiguracionTaller) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const updated = { ...c, actualizadoEn: Date.now() };
    const { error } = await sb.from('configuracion').upsert(updated, { onConflict: 'id' });
    if (error) throw new Error(error.message);
    setConfig(updated);
  }, []);

  return { config, cargando, guardar };
}
