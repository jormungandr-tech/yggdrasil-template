import {DatabaseAccessor} from '@yggdrasil-template/base';
import {PaymentDbFunctions} from '../application/functions';
import {getInvoiceDbFunctions} from '../infrastructure/controller/invoice';
import {getUserBalanceDbFunctions} from '../infrastructure/controller/userBalance';
import {getUserBalanceChangeLogDbFunctions} from '../infrastructure/controller/userBalanceChange';
import {getMethodProviderDbFunctions} from '../infrastructure/controller/paymentMethodProvider';

export function getDbFunctions(db: DatabaseAccessor): PaymentDbFunctions {
  return {
    ...getInvoiceDbFunctions(db),
    ...getUserBalanceDbFunctions(db),
    ...getUserBalanceChangeLogDbFunctions(db),
    ...getMethodProviderDbFunctions(db),
  }
}