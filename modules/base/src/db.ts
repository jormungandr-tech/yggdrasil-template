import {NeonDatabase} from 'drizzle-orm/neon-serverless/driver';
import {PostgresJsDatabase} from 'drizzle-orm/postgres-js/driver';
import {IO} from 'fp-ts/IO';

export type Postgres = NeonDatabase | PostgresJsDatabase;

export type DatabaseAccessor = IO<Postgres>

export function downcastInstance<T extends Postgres>(instance: T): T {
  return instance;
}