import {AffDbFunctions,MainFunctions} from './application/functions';
import {YggdrasilModule} from '@yggdrasil-template/base';
import {getMainFunctions, getDbFunctions} from './domain/mainFunctions';

export type {AffiliateStatistics, AffiliateGraph, AffiliateEventListener, AffiliateEvent} from './application/dto';

type ModuleInterface = MainFunctions & AffDbFunctions;

export const affiliate: YggdrasilModule<ModuleInterface> = ({db}) => {
  const dbc = getDbFunctions(db);
  return {
    ...getMainFunctions(dbc),
    ...dbc,
  }
}

export default affiliate;