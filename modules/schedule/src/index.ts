import {createDatabaseController, DatabaseController, getUtilsFunctions, UtilsFunctions} from './application/functions';
import {YggdrasilModule} from '@yggdrasil-template/base';

export type {RetryFunction, EventListener, EventConsumer, ConsumerError} from './application/consumer';
export {EventConsume} from './application/consumer';

type ModuleInterface = UtilsFunctions & DatabaseController;

const schedule: YggdrasilModule<ModuleInterface> = ({db}) => {
  return {
    ...createDatabaseController(db),
    ...getUtilsFunctions()
  }
}

export default schedule;