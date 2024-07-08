import {Option} from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import {TaskOption} from 'fp-ts/TaskOption';

export function parseProviderName(name: string): Option<PaymentMethodProviderName> {
  switch (name) {
    case PaymentMethodProviderName.Epay:
      return O.some(PaymentMethodProviderName.Epay);
    default:
      return O.none;
  }
}

export enum PaymentMethodProviderName {
  Epay = 'epay',
}

export interface PaymentCheckoutRequest<Extra = undefined> {
  readonly callbackUrl: string;
  readonly redirectUrl: string;
  readonly amount: number;
  readonly channel: string;
  readonly invoiceId: string;
  readonly productName: string;
  extra: Extra;
}

export interface ExternalPaymentResult {
  readonly success: boolean;
  readonly failReason?: string;
  readonly invoiceId: string;
}

export interface PaymentMethodProvider<Name extends PaymentMethodProviderName, Account, CheckoutExtra = undefined> {
  readonly type: Name;
  accountDeserializer: (account: string) => Option<Account>;
  readonly supportedChannels: readonly string [];
  checkout: (req: PaymentCheckoutRequest<CheckoutExtra>, account: Account) => TaskOption<string>;
  createPaymentResultListener: (
    target: string,
    callback: (result: ExternalPaymentResult) => TaskOption<void>
  ) => (req: ExternalPaymentResult) => TaskOption<void>;
}