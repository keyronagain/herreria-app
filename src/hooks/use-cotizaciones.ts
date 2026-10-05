'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { uid } from '@/lib/utils/id';
import { upsertPorId, quitarPorId } from '@/lib/utils/coleccion';
import type { Cotizacion } from '@/types';

export type CotizacionInput = Omit<Cotizacion, 'id' | 'creadoEn' | 'actualizadoEn'>;

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cargando, setCargando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    sb.from('cotizaciones')
      .select('*')
      .order('fecha', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setCotizaciones((data ?? []) as Cotizacion[]);
        setCargando(false);
      });

    const channel = sb
      .channel(`cotizaciones-changes-${uid()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cotizaciones' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setCotizaciones((prev) => quitarPorId(prev, (payload.old as { id: string }).id));
        } else {
          setCotizaciones((prev) => upsertPorId(prev, payload.new as Cotizacion, 'inicio'));
        }
      })
      .subscribe();

    return () => {
      void sb.removeChannel(channel);
    };
  }, []);

  const siguienteNumero = useCallback((): string => {
    const max = cotizaciones.reduce((acc, c) => {
      const n = parseInt(c.numero.replace(/\D/g, ''), 10);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `C-${String(max + 1).padStart(4, '0')}`;
  }, [cotizaciones]);

  const crear = useCallback(async (input: CotizacionInput) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const now = Date.now();
    const { data, error } = await sb
      .from('cotizaciones')
      .insert({ ...input, id: uid(), creadoEn: now, actualizadoEn: now })
      .select()
      .single();
    if (error) throw new Error(error.message);
    setCotizaciones((prev) => upsertPorId(prev, data as Cotizacion, 'inicio'));
  }, []);

  const actualizar = useCallback(async (id: string, changes: Partial<Cotizacion>) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { data, error } = await sb
      .from('cotizaciones')
      .update({ ...changes, actualizadoEn: Date.now() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    setCotizaciones((prev) => upsertPorId(prev, data as Cotizacion, 'inicio'));
  }, []);

  const eliminar = useCallback(async (id: string) => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { error } = await sb.from('cotizaciones').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setCotizaciones((prev) => quitarPorId(prev, id));
  }, []);

  const desvincularProyecto = useCallback(async (proyectoId: string): Promise<void> => {
    const sb = getSupabase();
    if (!sb) return;
    const now = Date.now();
    const { error } = await sb
      .from('cotizaciones')
      .update({ proyectoId: null, actualizadoEn: now })
      .eq('proyectoId', proyectoId);
    if (error) throw new Error(error.message);
    setCotizaciones((prev) =>
      prev.map((c) => (c.proyectoId === proyectoId ? { ...c, proyectoId: undefined, actualizadoEn: now } : c)),
    );
  }, []);

  return { cotizaciones, cargando, siguienteNumero, crear, actualizar, eliminar, desvincularProyecto };
}
