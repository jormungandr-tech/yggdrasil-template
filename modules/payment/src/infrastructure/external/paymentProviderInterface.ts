import {Option} from 'fp-ts/Option';
import {TaskOption} from 'fp-ts/TaskOption';

export enum PaymentMethodProviderName {
  Epay = 'epay',
}

export interface PaymentCheckoutRequest<Extra = undefined> {
  callbackUrl: string;
  redirectUrl: string;
  amount: number;
  channel: string;
  orderId: string;
  productName: string;
  extra: Extra;
}

export interface PaymentMethodProvider<Name extends PaymentMethodProviderName, Account, CheckoutExtra = undefined> {
  type: Name;
  accountDeserializer: (account: string) => Option<Account>;
  supportedChannels: string[];
  checkout: (req: PaymentCheckoutRequest<CheckoutExtra>, account: Account) => TaskOption<string>;
}