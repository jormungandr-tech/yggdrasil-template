export interface VerificationInfo {
  verifyCode: string | null;
  verifyCodeSentAt: Date | null;
  verified: boolean;
  verifiedAt: Date | null;
}

export interface EmailAuthProviderRecord extends VerificationInfo {
  email: string;
  passwordHash: string;
  authKey: string;
}

export interface PhoneAuthProviderRecord extends VerificationInfo {
  phone: string;
  passwordHash: string;
  authKey: string;
}

export interface UserAuthRecord {
  authProvider: string;
  authKey: string;
  userId: string;
}

export interface SessionValue {
  userId: string;
}

export function sessionKey(token: string): string {
  return `ygg_auth__session:${token}`;
}