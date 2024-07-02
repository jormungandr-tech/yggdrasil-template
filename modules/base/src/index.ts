import {DatabaseAccessor, RedisAccessor} from './db';

export type {Postgres, DatabaseAccessor} from './db';
export {downcastInstance} from './db';
export {autoRetry} from './expection';
export {delayTask, delayTaskOption} from './expection';
export * as tracer from './log';
export * as message from './result'

export interface GeneralDependencies {
  db: DatabaseAccessor;
  redis: RedisAccessor;
}

export interface YggdrasilModule<I> {
  (deps: GeneralDependencies): I;
}