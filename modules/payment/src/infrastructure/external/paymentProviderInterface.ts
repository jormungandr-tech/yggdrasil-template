import {Option} from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import {TaskOption} from 'fp-ts/TaskOption';
import {Task} from 'fp-ts/Task';
import {Either} from 'fp-ts/Either';

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

export type ExternalPaymentResult = Either<ExternalPaymentFailResult, ExternalPaymentSuccessResult>

export interface ExternalPaymentSuccessResult {
  readonly invoiceId: string;
  readonly externalOrderId: string;
}

export interface ExternalPaymentFailResult {
  readonly reason: string;
  readonly invoiceId: string;
}

export interface PaymentMethodProvider<Name extends PaymentMethodProviderName, Account, CallbackBody, CheckoutExtra = undefined> {
  readonly type: Name;
  accountDeserializer: (account: string) => Option<Account>;
  readonly supportedChannels: readonly string [];
  checkout: (req: PaymentCheckoutRequest<CheckoutExtra>, account: Account) => Task<ExternalPaymentResult>;
  createPaymentResultListener: (
    target: Account,
    callback: (result: ExternalPaymentResult) => TaskOption<void>
  ) => (req: ExternalPaymentResult) => TaskOption<void>;
  parseCallbackRequestBody: (body: CallbackBody, account: Account) => Option<ExternalPaymentResult>;
}