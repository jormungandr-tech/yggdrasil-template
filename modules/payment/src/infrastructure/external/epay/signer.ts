import {CommonObj, SignedRequest} from './interface';
import crypto from 'crypto';


function md5(str: string): string {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

function implGetSigned<T extends CommonObj>(body: T, key: string): SignedRequest<T> {
  const keys = Object.keys(body).sort();
  const values: string[] = keys
    .map(k => {
      const v = body[k];
      if (v === undefined) {
        return '';
      }
      return `${k}=${v}`;
    })
    .filter(v => v !== '');
  const signProp = values.join('&') + key;
  const md5Result = md5(signProp);
  return {
    ...body,
    sign: md5Result,
    sign_type: 'MD5'
  };
}

export function getSigned<T extends CommonObj>(key: string): (body: T) => SignedRequest<T> {
  return body => implGetSigned(body, key);
}

export function getUnsigned<T extends CommonObj>(signed: SignedRequest<T>): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {sign, sign_type, ...rest} = signed;
  return rest as unknown as T;
}

function implVerifySign<T extends CommonObj>(key: string, signed: SignedRequest<T>): boolean {
  const unsigned = getUnsigned(signed);
  const signedAgain = implGetSigned(unsigned, key);
  return signed.sign === signedAgain.sign;
}

export function verifySign<T extends CommonObj>(key: string): (signed: SignedRequest<T>) => boolean {
  return signed => implVerifySign(key, signed);
}