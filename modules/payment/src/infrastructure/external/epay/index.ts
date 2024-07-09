import {
  ExternalPaymentResult,
  PaymentCheckoutRequest,
  PaymentMethodProvider,
  PaymentMethodProviderName,
} from '../paymentProviderInterface';
import {CheckoutExtra, ResultCallBackQuery, supportedChannels} from './interface';
import * as Json from 'fp-ts/Json';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as TO from 'fp-ts/TaskOption';
import * as TA from 'fp-ts/Task';
import {tracer} from '@yggdrasil-template/base'
import {Option} from 'fp-ts/Option';
import {pipe} from 'fp-ts/function';
import {castRequest, castResponse, sendCheckoutRequest} from './checkout';
import {getSigned, verifySign} from './signer';

export interface EpayAccountConfig {
  pid: number;
  key: string;
  baseUrl: string;
}

function accountDeserializer(account: string): Option<EpayAccountConfig> {
  return pipe(
    Json.parse(account),
    O.fromEither,
    O.flatMap(obj => {
      if (typeof obj !== 'object' || obj === null) {
        return O.none;
      }
      if (obj instanceof Array) {
        return O.none;
      }
      const pid = obj['pid'];
      const key = obj['key'];
      const baseUrl = obj['baseUrl'];
      if (typeof pid !== 'number' || typeof key !== 'string' || typeof baseUrl !== 'string') {
        return O.none;
      }
      return O.some({pid, key, baseUrl});
    }),
  );
}

function checkout(
  req: PaymentCheckoutRequest<CheckoutExtra>,
  account: EpayAccountConfig,
): TA.Task<ExternalPaymentResult> {
  return pipe(
    castRequest(req, account),
    getSigned(account.key),
    sendCheckoutRequest(account.baseUrl),
    TO.match(
      () => E.left({
        reason: 'Request failed',
        invoiceId: req.invoiceId,
      }),
      castResponse(req),
    ),
  );
}

function parseCallbackRequestBody(body: ResultCallBackQuery, account: EpayAccountConfig): Option<ExternalPaymentResult> {
  const valid = verifySign(account.key)(body);
  if (!valid) {
    return O.none;
  }
  return O.some(E.right({
    invoiceId: body.out_trade_no,
    externalOrderId: body.trade_no,
  }));
}

function createPaymentResultListener(
  target: EpayAccountConfig,
  callback: (result: ExternalPaymentResult) => TO.TaskOption<void>,
): (req: ExternalPaymentResult) => TO.TaskOption<void> {
  return (result: ExternalPaymentResult) => {
    return pipe(
      callback(result),
      TO.match(
        () => {
          tracer.error('Payment', `Error occurred when epay ${target.pid} handling payment result.`)
          return O.none
        },
        () => {
          tracer.info('Payment', `Payment result handled successfully by epay ${target.pid}`)
          return O.some(undefined)
        }
      )
    )
  };
}

export const epay: PaymentMethodProvider<PaymentMethodProviderName.Epay, EpayAccountConfig, ResultCallBackQuery, CheckoutExtra> = {
  type: PaymentMethodProviderName.Epay,
  accountDeserializer,
  supportedChannels,
  checkout,
  parseCallbackRequestBody,
  createPaymentResultListener
};