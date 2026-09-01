import type { Table, UpdateSpec } from 'dexie';
import { uid } from '@/lib/utils/id';

export type BaseRecord = {
  id: string;
  creadoEn: number;
  actualizadoEn: number;
};

export abstract class BaseRepository<T extends BaseRecord> {
  protected constructor(protected table: Table<T, string>) {}

  async all(): Promise<T[]> {
    return this.table.toArray();
  }

  async get(id: string): Promise<T | undefined> {
    return this.table.get(id);
  }

  async create(
    data: Omit<T, 'id' | 'creadoEn' | 'actualizadoEn'> & { id?: string },
  ): Promise<string> {
    const id = data.id ?? uid();
    const now = Date.now();
    const record = { ...data, id, creadoEn: now, actualizadoEn: now } as T;
    await this.table.add(record);
    return id;
  }

  async update(id: string, changes: Partial<T>): Promise<void> {
    await this.table.update(id, {
      ...changes,
      actualizadoEn: Date.now(),
    } as UpdateSpec<T>);
  }

  async remove(id: string): Promise<void> {
    await this.table.delete(id);
  }
}
