import {DbFunctions, MainFunctions} from './application/functions';
import {YggdrasilModule} from '@yggdrasil-template/base';
import {getDbFunctions} from './infrastructure/controller/production';
import {getMainFunctions} from './domain/mainFunctions';

type ModuleInterface = DbFunctions & MainFunctions;

export const shop: YggdrasilModule<ModuleInterface> = ({db}) => {
  const dbf = getDbFunctions(db);
  return {
    ...dbf,
    ...getMainFunctions(dbf)
  }
}