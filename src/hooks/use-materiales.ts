'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { uid } from '@/lib/utils/id';
import { seedMateriales, CATALOGO, LARGO_BARRA_CM } from '@/data/seed';
import type { Material } from '@/types';

export type MaterialInput = Omit<Material, 'id' | 'creadoEn' | 'actualizadoEn'>;

export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    async function cargar() {
      try {
        const { data } = await sb!.from('materiales').select('*').order('creadoEn', { ascending: true });
        const rows = (data ?? []) as Material[];
        if (rows.length === 0) {
          const seeded = await seedMateriales(sb!);
          setMateriales(seeded);
        } else {
          setMateriales(rows);
        }
      } catch {
        // seed o red fallaron; continuar con lista vacía
      } finally {
        setCargando(false);
      }
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

  const restablecerCatalogo = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase no configurado');
    const { error: errDel } = await sb.from('materiales').delete().neq('id', '');
    if (errDel) throw new Error(errDel.message);
    const now = Date.now();
    const nuevos: Material[] = CATALOGO.map((m) => ({
      id: uid(),
      nombre: m.nombre,
      tipo: m.tipo,
      dims: m.dims,
      largoBarra: LARGO_BARRA_CM,
      precioBarra: m.precioBarra,
      precioUnitario: Math.round((m.precioBarra / (LARGO_BARRA_CM / 100)) * 100) / 100,
      unidad: 'metro' as const,
      categoria: m.categoria,
      activo: true,
      creadoEn: now,
      actualizadoEn: now,
    }));
    const { error: errIns } = await sb.from('materiales').insert(nuevos);
    if (errIns) throw new Error(errIns.message);
  }, []);

  return { materiales, cargando, crear, actualizar, eliminar, restablecerCatalogo };
}
