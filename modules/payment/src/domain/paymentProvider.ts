import {epay} from '../infrastructure/external/epay';
import {PaymentMethodProvider, PaymentMethodProviderName} from '../infrastructure/external/paymentProviderInterface';

interface paymentProviderList {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key : string]: PaymentMethodProvider<PaymentMethodProviderName, any, any, any>
}

export const paymentProviders = {
  epay: epay
} satisfies paymentProviderList;