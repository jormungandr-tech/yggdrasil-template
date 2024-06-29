import {DatabaseAccessor} from './db';

export type {Postgres, DatabaseAccessor} from './db';
export {downcastInstance} from './db';
export {autoRetry} from './expection';
export {delayTask, delayTaskOption} from './expection';
export * as tracer from './log';

export interface GeneralDependencies {
  db: DatabaseAccessor;
}

export interface YggdrasilModule<I> {
  (deps: GeneralDependencies): I;
}