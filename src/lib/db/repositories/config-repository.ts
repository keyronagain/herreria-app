import { db } from '@/lib/db/db';
import { CONFIG_ID } from '@/constants';
import type { ConfiguracionTaller } from '@/types';

class ConfigRepository {
  async get(): Promise<ConfiguracionTaller | undefined> {
    return db.configuracion.get(CONFIG_ID);
  }

  async save(config: ConfiguracionTaller): Promise<void> {
    await db.configuracion.put(config);
  }
}

export const configRepository = new ConfigRepository();
