import {paymentProviders} from './domain/paymentProvider';
import {YggdrasilModule} from '@yggdrasil-template/base';
import {PaymentDbFunctions} from './application/functions';
import {getDbFunctions} from './domain/dbFunctions';

type ModuleInterface = typeof paymentProviders & PaymentDbFunctions;

export const payment: YggdrasilModule<ModuleInterface> = ({db}) => {
  return {
    ...paymentProviders,
    ...getDbFunctions(db)
  }
}

export default payment;