import { db } from '@/lib/db/db';
import { BaseRepository } from '@/lib/db/base-repository';
import type { Proyecto } from '@/types';

class ProyectoRepository extends BaseRepository<Proyecto> {
  constructor() {
    super(db.proyectos);
  }
}

export const proyectoRepository = new ProyectoRepository();
