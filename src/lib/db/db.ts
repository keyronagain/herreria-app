import Dexie, { type Table } from 'dexie';
import type {
  Material,
  Proyecto,
  Cotizacion,
  ConfiguracionTaller,
} from '@/types';

export class HerreriaDB extends Dexie {
  materiales!: Table<Material, string>;
  proyectos!: Table<Proyecto, string>;
  cotizaciones!: Table<Cotizacion, string>;
  configuracion!: Table<ConfiguracionTaller, string>;

  constructor() {
    super('herreria-db');
    this.version(1).stores({
      materiales: 'id, tipo, categoria, nombre, creadoEn',
      proyectos: 'id, estado, cliente, nombre, creadoEn',
      cotizaciones: 'id, numero, estado, fecha, proyectoId',
      configuracion: 'id',
    });
  }
}

export const db = new HerreriaDB();
