'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

export function useSync() {
  const [sesion, setSesion] = useState<Session | null>(null);
  const [comprobando, setComprobando] = useState(() => Boolean(getSupabase()));

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let activo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      setSesion(data.session);
      setComprobando(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSesion(s);
    });

    return () => {
      activo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const iniciarSesion = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase no configurado');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
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

  return { sesion, comprobando, iniciarSesion, registrar, cerrarSesion };
}
