import {IO} from 'fp-ts/IO';
import Redis from 'ioredis';

import { drizzle as pgJsDrizzle } from 'drizzle-orm/postgres-js';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';

export type Postgres = ReturnType<typeof pgJsDrizzle> | ReturnType<typeof neonDrizzle>;

export type DatabaseAccessor = IO<Postgres>

export type RedisAccessor = IO<Redis>

export function downcastInstance<T extends Postgres>(instance: T): T {
  return instance;
}