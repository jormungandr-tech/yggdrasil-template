import {NeonDatabase} from 'drizzle-orm/neon-serverless/driver';
import {PostgresJsDatabase} from 'drizzle-orm/postgres-js/driver';

export type Postgres = NeonDatabase | PostgresJsDatabase;

export function downcastInstance<T extends Postgres>(instance: T): T {
  return instance;
}