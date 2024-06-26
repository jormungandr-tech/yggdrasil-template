import {VerificationInfo} from '../../application/dto';
import {IO} from 'fp-ts/IO';

/**
 * Verify that the code is valid
 * @param verificationInfo
 * @param userProvidedCode
 * @param maxAge - The maximum age of the code in seconds
 */
export function verifyCodeValid(
  verificationInfo: VerificationInfo,
  userProvidedCode: string,
  maxAge: number
): IO<boolean> {
  return () => {
    if (verificationInfo.verifyCode !== userProvidedCode) {
      return false;
    }
    if (verificationInfo.verifyCodeSentAt === null) {
      return false;
    }
    const now = new Date();
    const diff = now.getTime() - verificationInfo.verifyCodeSentAt.getTime();
    return diff < maxAge * 1000;
  }
}