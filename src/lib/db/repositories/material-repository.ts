import { db } from '@/lib/db/db';
import { BaseRepository } from '@/lib/db/base-repository';
import type { Material } from '@/types';

class MaterialRepository extends BaseRepository<Material> {
  constructor() {
    super(db.materiales);
  }

  async activos(): Promise<Material[]> {
    return (await this.all()).filter((m) => m.activo !== false);
  }

  async buscar(termino: string): Promise<Material[]> {
    const t = termoNormalizado(termino);
    if (!t) return this.all();
    return (await this.all()).filter(
      (m) =>
        m.nombre.toLowerCase().includes(t) ||
        (m.categoria ?? '').toLowerCase().includes(t) ||
        (m.proveedor ?? '').toLowerCase().includes(t),
    );
  }
}

function termoNormalizado(termino: string): string {
  return termino.trim().toLowerCase();
}

export const materialRepository = new MaterialRepository();
