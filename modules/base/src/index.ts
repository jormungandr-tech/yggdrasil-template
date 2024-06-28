import {DatabaseAccessor} from './db';

export type {Postgres, DatabaseAccessor} from './db';
export {downcastInstance} from './db';

export interface GeneralDependencies {
  db: DatabaseAccessor;
}

export interface YggdrasilModule<I> {
  (deps: GeneralDependencies): I;
}