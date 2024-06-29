import {
  createDatabaseController,
  DatabaseController,
  getUtilsFunctions,
  MainFunctions,
  UtilsFunctions,
} from './application/functions';
import {YggdrasilModule} from '@yggdrasil-template/base';
import {createMainFunctions} from './domain/mainFunctions';

export type {ScheduledEvent, ScheduledEventInDb, MAGIC_EVENT} from './application/dto';
export {MAGIC_EVENT_TIMESTAMP} from './application/dto';
export type {RetryFunction, EventListener, EventConsumer, ConsumerError} from './application/consumer';
export {EventConsume} from './application/consumer';

type ModuleInterface = UtilsFunctions & DatabaseController & MainFunctions;

export const schedule: YggdrasilModule<ModuleInterface> = ({db}) => {
  const dbc = createDatabaseController(db);
  return {
    ...dbc,
    ...createMainFunctions(dbc),
    ...getUtilsFunctions()
  }
}

export default schedule;