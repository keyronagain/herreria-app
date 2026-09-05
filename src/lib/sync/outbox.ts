import { db } from '@/lib/db/db';
import type { SyncEntidad } from '@/types';

export async function encolar(entidad: SyncEntidad, id: string): Promise<void> {
  await db.syncQueue.put({
    clave: `${entidad}:${id}`,
    entidad,
    entidadId: id,
    creadoEn: Date.now(),
  });
}
