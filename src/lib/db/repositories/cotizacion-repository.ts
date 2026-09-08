import { db } from '@/lib/db/db';
import { BaseRepository } from '@/lib/db/base-repository';
import { encolar } from '@/lib/sync/outbox';
import type { Cotizacion } from '@/types';

class CotizacionRepository extends BaseRepository<Cotizacion> {
  protected entidad = 'cotizaciones' as const;

  constructor() {
    super(db.cotizaciones);
  }

  async siguienteNumero(): Promise<string> {
    const todas = await this.all();
    const max = todas.reduce((acc, c) => {
      const n = parseInt(c.numero.replace(/\D/g, ''), 10);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return `C-${String(max + 1).padStart(4, '0')}`;
  }

  async desvincularProyecto(proyectoId: string): Promise<void> {
    const cots = await db.cotizaciones
      .where('proyectoId')
      .equals(proyectoId)
      .toArray();
    for (const c of cots) {
      const copia = { ...c };
      delete copia.proyectoId;
      copia.actualizadoEn = Date.now();
      await db.cotizaciones.put(copia);
      void encolar('cotizaciones', c.id);
    }
  }
}

export const cotizacionRepository = new CotizacionRepository();
