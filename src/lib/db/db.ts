import Dexie, { type Table } from 'dexie';
import type {
  Material,
  Proyecto,
  Cotizacion,
  ConfiguracionTaller,
  SyncOp,
} from '@/types';

export class HerreriaDB extends Dexie {
  materiales!: Table<Material, string>;
  proyectos!: Table<Proyecto, string>;
  cotizaciones!: Table<Cotizacion, string>;
  configuracion!: Table<ConfiguracionTaller, string>;
  syncQueue!: Table<SyncOp, string>;

  constructor() {
    super('herreria-db');
    this.version(1).stores({
      materiales: 'id, tipo, categoria, nombre, creadoEn',
      proyectos: 'id, estado, cliente, nombre, creadoEn',
      cotizaciones: 'id, numero, estado, fecha, proyectoId',
      configuracion: 'id',
    });
    this.version(2).stores({
      materiales: 'id, tipo, categoria, nombre, creadoEn',
      proyectos: 'id, estado, cliente, nombre, creadoEn',
      cotizaciones: 'id, numero, estado, fecha, proyectoId',
      configuracion: 'id',
      syncQueue: 'clave, entidad, creadoEn',
    });
  }
}

export const db = new HerreriaDB();
