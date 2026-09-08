'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { sincronizar, type ResultadoSync } from '@/lib/sync/sync-engine';
import type { Session } from '@supabase/supabase-js';

export function useSync() {
  const [sesion, setSesion] = useState<Session | null>(null);
  const [comprobando, setComprobando] = useState(() => Boolean(getSupabase()));
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let activo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      setSesion(data.session);
      setComprobando(false);
      if (data.session) void sincronizar();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSesion(s);
    });

    return () => {
      activo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sesion) return;
    const handler = () => void sincronizar();
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
  }, [sesion]);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase no configurado');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    void sincronizar();
  }, []);

  const registrar = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.session) {
      throw new Error('Revisa tu correo para confirmar la cuenta.');
    }
  }, []);

  const cerrarSesion = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const sincronizarAhora = useCallback(async (): Promise<ResultadoSync> => {
    setSincronizando(true);
    try {
      return await sincronizar();
    } finally {
      setSincronizando(false);
    }
  }, []);

  return {
    sesion,
    comprobando,
    sincronizando,
    iniciarSesion,
    registrar,
    cerrarSesion,
    sincronizarAhora,
  };
}
