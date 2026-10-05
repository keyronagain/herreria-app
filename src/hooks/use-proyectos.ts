'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { uid } from '@/lib/utils/id';
import { upsertPorId, quitarPorId } from '@/lib/utils/coleccion';
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
      .then(({ data, error }) => {
        if (!error) setProyectos((data ?? []) as Proyecto[]);
        setCargando(false);
      });

    const channel = sb
      .channel(`proyectos-changes-${uid()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proyectos' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setProyectos((prev) => quitarPorId(prev, (payload.old as { id: string }).id));
        } else {
          setProyectos((prev) => upsertPorId(prev, payload.new as Proyecto, 'inicio'));
        }
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const crear = useCallback(async (input: ProyectoInput) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const now = Date.now();
    const { data, error } = await sb
      .from('proyectos')
      .insert({ ...input, id: uid(), creadoEn: now, actualizadoEn: now })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProyectos((prev) => upsertPorId(prev, data as Proyecto, 'inicio'));
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Proyecto>) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { data, error } = await sb
      .from('proyectos')
      .update({ ...changes, actualizadoEn: Date.now() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setProyectos((prev) => upsertPorId(prev, data as Proyecto, 'inicio'));
  }, []);

  const eliminar = useCallback(async (id: string) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { error } = await sb.from('proyectos').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setProyectos((prev) => quitarPorId(prev, id));
  }, []);

  return { proyectos, cargando, crear, actualizar, eliminar };
}
