'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { uid } from '@/lib/utils/id';
import { seedMateriales } from '@/data/seed';
import type { Material } from '@/types';

export type MaterialInput = Omit<Material, 'id' | 'creadoEn' | 'actualizadoEn'>;

export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    async function cargar() {
      const { data } = await sb!.from('materiales').select('*').order('creadoEn', { ascending: true });
      const rows = (data ?? []) as Material[];
      if (rows.length === 0) {
        const seeded = await seedMateriales(sb!);
        setMateriales(seeded);
      } else {
        setMateriales(rows);
      }
      setCargando(false);
    }

    void cargar();

    const channel = sb
      .channel('materiales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materiales' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMateriales((prev) => [...prev, payload.new as Material]);
        } else if (payload.eventType === 'UPDATE') {
          setMateriales((prev) =>
            prev.map((m) => (m.id === (payload.new as Material).id ? (payload.new as Material) : m)),
          );
        } else if (payload.eventType === 'DELETE') {
          setMateriales((prev) => prev.filter((m) => m.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const crear = useCallback(async (input: MaterialInput) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const now = Date.now();
    const { error } = await sb.from('materiales').insert({ ...input, id: uid(), creadoEn: now, actualizadoEn: now });
    if (error) throw new Error(error.message);
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Material>) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { error } = await sb.from('materiales').update({ ...changes, actualizadoEn: Date.now() }).eq('id', id);
    if (error) throw new Error(error.message);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { error } = await sb.from('materiales').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }, []);

  return { materiales, cargando, crear, actualizar, eliminar };
}
