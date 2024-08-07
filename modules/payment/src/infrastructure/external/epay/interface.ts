export interface CommonObj {
  [key: string]: unknown;
}

export type SignedRequest<T extends CommonObj> = T & {
  sign: string;
  sign_type: 'MD5';
}

export const supportedChannels = ['alipay', 'wxpay', 'usdt'] as const;

export type SupportedPaymentMethod = 'alipay' | 'wxpay' | 'usdt'

interface CheckoutPropsBase {
  /**
   * @description your ePay ID
   */
  pid: number;
  type: SupportedPaymentMethod;
  /**
   * @description The order ID in your system
   */
  out_trade_no: string;

  /**
   * @description ePay will call this URL to notify the payment result
   */
  notify_url: string;

  /**
   * @description after paid, user will be redirected to this URL
   */
  return_url: string;

  /**
   * @description The name of the product
   */
  name: string;

  /**
   * @description The price of the product. is a string with 2 decimal places
   */
  money: string;
}


/**
 * @description GET (as query) or POST (as body) to `/submit.php`, it will redirect to the payment page.
 */
export interface PageRedirectCheckoutQuery extends CheckoutPropsBase {}

export interface CheckoutExtra {
  /**
   * @description The IP address of the user
   */
  clientip: string;

  device: 'pc' | 'mobile' | 'qq' | 'wechat' | 'alipay';
}

export interface ServerSideCheckoutBody extends CheckoutPropsBase, CommonObj, CheckoutExtra {
}

export interface ServerSideCheckoutResponse {
  code: number;
  msg?: string;

  /**
   * @description The order ID in ePay system
   */
  trade_no: string;

  payurl?: string;
  qrcode?: string;
  urlscheme?: string;
}

interface ResultCallbackBase extends CommonObj {
  /**
   * @description your ePay ID
   */
  pid: number;

  /**
   * @description The order ID in ePay system
   */
  trade_no: string;

  /**
   * @description The order ID in your system
   */
  out_trade_no: string;

  type: SupportedPaymentMethod;

  /**
   * @description The name of the product
   */
  name: string;

  /**
   * @description The price of the product. is a string with 2 decimal places
   */
  money: string;

  /**
   * @description The status of the payment, `TRADE_SUCCESS` means the payment is successful
   */
  trade_status: 'TRADE_SUCCESS' | string;
}

export interface ResultCallBackQuery extends SignedRequest<ResultCallbackBase> {}