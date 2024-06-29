import {
  createDatabaseController,
  DatabaseController,
  getUtilsFunctions,
  MainFunctions,
  UtilsFunctions,
} from './application/functions';
import {YggdrasilModule} from '@yggdrasil-template/base';
import {createMainFunctions} from './domain/mainFunctions';

export type {RetryFunction, EventListener, EventConsumer, ConsumerError} from './application/consumer';
export {EventConsume} from './application/consumer';

type ModuleInterface = UtilsFunctions & DatabaseController & MainFunctions;

const schedule: YggdrasilModule<ModuleInterface> = ({db}) => {
  const dbc = createDatabaseController(db);
  return {
    ...dbc,
    ...createMainFunctions(dbc),
    ...getUtilsFunctions()
  }
}

export default schedule;