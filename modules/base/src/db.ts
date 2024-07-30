import {IO} from 'fp-ts/IO';
import Redis from 'ioredis';

import { drizzle } from 'drizzle-orm/postgres-js';

export type Postgres = ReturnType<typeof drizzle>;

export type DatabaseAccessor = IO<Postgres>

export type RedisAccessor = IO<Redis>

export function downcastInstance<T extends Postgres>(instance: T): T {
  return instance;
}