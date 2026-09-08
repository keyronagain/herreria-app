import { db } from '@/lib/db/db';
import { getSupabase } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SyncEntidad } from '@/types';

const ULTIMO_SYNC_KEY = 'herreria:ultimoSync';

interface FilaSync {
  entidad: string;
  id: string;
  data: Record<string, unknown>;
  updated_at: string;
  deleted: boolean;
}

export interface ResultadoSync {
  ok: boolean;
  motivo?: string;
  empujadas?: number;
  jaladas?: number;
}

type TablaSync = {
  get(id: string): Promise<{ id: string; actualizadoEn?: number } | undefined>;
  put(record: Record<string, unknown>): Promise<unknown>;
  delete(id: string): Promise<void>;
};

function tabla(entidad: SyncEntidad): TablaSync {
  return db[entidad] as unknown as TablaSync;
}

export async function sincronizar(): Promise<ResultadoSync> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, motivo: 'Supabase no configurado' };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { ok: false, motivo: 'No has iniciado sesión' };

  try {
    const empujadas = await empujar(supabase);
    const jaladas = await jalar(supabase);
    return { ok: true, empujadas, jaladas };
  } catch (err) {
    return {
      ok: false,
      motivo:
        err instanceof Error ? err.message : 'Error de sincronización',
    };
  }
}

async function empujar(supabase: SupabaseClient): Promise<number> {
  const ops = await db.syncQueue.toArray();
  let n = 0;
  for (const op of ops) {
    const t = tabla(op.entidad);
    const registro = await t.get(op.entidadId);
    const fila = {
      entidad: op.entidad,
      id: op.entidadId,
      data: registro ?? {},
      deleted: !registro,
    };
    const { error } = await supabase
      .from('sync_rows')
      .upsert(fila, { onConflict: 'entidad,id' });
    if (error) {
      throw new Error(`Error al subir ${op.entidad}: ${error.message}`);
    }
    await db.syncQueue.delete(op.clave);
    n++;
  }
  return n;
}

async function jalar(supabase: SupabaseClient): Promise<number> {
  const ultimo = localStorage.getItem(ULTIMO_SYNC_KEY);

  let query = supabase.from('sync_rows').select('*');
  if (ultimo) query = query.gt('updated_at', ultimo);

  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al descargar: ${error.message}`);
  }
  if (!data) return 0;

  const filas = data as unknown as FilaSync[];
  let n = 0;

  for (const fila of filas) {
    const entidad = fila.entidad as SyncEntidad;
    if (!['materiales', 'proyectos', 'cotizaciones', 'configuracion'].includes(entidad)) {
      continue;
    }
    const t = tabla(entidad);
    const local = await t.get(fila.id);
    const remotoMs = new Date(fila.updated_at).getTime();

    if (fila.deleted) {
      if (!local || remotoMs >= (local.actualizadoEn ?? 0)) {
        await t.delete(fila.id);
        n++;
      }
    } else if (!local || remotoMs >= (local.actualizadoEn ?? 0)) {
      await t.put(fila.data);
      n++;
    }
  }

  if (filas.length > 0) {
    const max = filas.reduce(
      (m, f) => Math.max(m, new Date(f.updated_at).getTime()),
      0,
    );
    localStorage.setItem(ULTIMO_SYNC_KEY, new Date(max).toISOString());
  }

  return n;
}
