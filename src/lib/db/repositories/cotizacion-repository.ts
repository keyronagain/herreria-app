import { db } from '@/lib/db/db';
import { BaseRepository } from '@/lib/db/base-repository';
import type { Cotizacion } from '@/types';

class CotizacionRepository extends BaseRepository<Cotizacion> {
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
}

export const cotizacionRepository = new CotizacionRepository();
