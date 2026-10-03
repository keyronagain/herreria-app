'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { uid } from '@/lib/utils/id';
import type { Proyecto } from '@/types';

export type ProyectoInput = Omit<Proyecto, 'id' | 'creadoEn' | 'actualizadoEn'>;

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    sb.from('proyectos')
      .select('*')
      .order('creadoEn', { ascending: false })
      .then(({ data }) => {
        setProyectos((data ?? []) as Proyecto[]);
        setCargando(false);
      });

    const channel = sb
      .channel('proyectos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proyectos' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProyectos((prev) => [payload.new as Proyecto, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setProyectos((prev) =>
            prev.map((p) => (p.id === (payload.new as Proyecto).id ? (payload.new as Proyecto) : p)),
          );
        } else if (payload.eventType === 'DELETE') {
          setProyectos((prev) => prev.filter((p) => p.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const crear = useCallback(async (input: ProyectoInput) => {
    const sb = getSupabase();
    if (!sb) return;
    const now = Date.now();
    await sb.from('proyectos').insert({ ...input, id: uid(), creadoEn: now, actualizadoEn: now });
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Proyecto>) => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from('proyectos').update({ ...changes, actualizadoEn: Date.now() }).eq('id', id);
  }, []);

  const eliminar = useCallback(async (id: string) => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.from('proyectos').delete().eq('id', id);
  }, []);

  return { proyectos, cargando, crear, actualizar, eliminar };
}
