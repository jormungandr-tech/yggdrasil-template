import {
  CheckoutExtra,
  ServerSideCheckoutBody,
  ServerSideCheckoutResponse,
  SignedRequest,
  SupportedPaymentMethod,
} from './interface';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import axios from 'axios';
import {ExternalPaymentResult, PaymentCheckoutRequest} from '../paymentProviderInterface';
import {EpayAccountConfig} from './index';
import * as E from 'fp-ts/Either';

function checkoutUrl(base: string): string {
  return `${base}/mapi.php`;
}

function implSendCheckoutRequest(
  baseUrl: string,
  body: SignedRequest<ServerSideCheckoutBody>,
): TaskOption<ServerSideCheckoutResponse> {
  return tryCatch(() => {
    return new Promise((res, rej) => {
      axios.post<ServerSideCheckoutResponse>(checkoutUrl(baseUrl), body)
        .then(r => res(r.data))
        .catch(rej)
    })
  })
}

export function sendCheckoutRequest(baseUrl: string): (body: SignedRequest<ServerSideCheckoutBody>) => TaskOption<ServerSideCheckoutResponse> {
  return body => implSendCheckoutRequest(baseUrl, body);
}

export function castRequest(
  req: PaymentCheckoutRequest<CheckoutExtra>,
  account: EpayAccountConfig
): ServerSideCheckoutBody {
  return {
    pid: account.pid,
    type: req.channel as SupportedPaymentMethod,
    out_trade_no: req.invoiceId,
    notify_url: req.callbackUrl,
    return_url: req.redirectUrl,
    name: req.productName,
    money: req.amount.toFixed(2),
    clientip: req.extra.clientip,
    device: req.extra.device,
  }
}

function implCastResponse(req: PaymentCheckoutRequest<CheckoutExtra>, res: ServerSideCheckoutResponse): ExternalPaymentResult {
  if (res.code !== 1) {
    return E.left({
      reason: res.msg || 'Unknown error',
      invoiceId: req.invoiceId,
    })
  } else {
    return E.right({
      invoiceId: req.invoiceId,
      externalOrderId: res.trade_no,
    })
  }
}

export function castResponse(req: PaymentCheckoutRequest<CheckoutExtra>): (res: ServerSideCheckoutResponse) => ExternalPaymentResult {
  return res => implCastResponse(req, res);
}