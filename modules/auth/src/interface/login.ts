import {ExternalProvider, InternalProvider} from './base';

export interface ExternalLoginRequest {
  provider: ExternalProvider;
  code: string;
}

export interface InternalLoginRequest {
  provider: InternalProvider;
  account: string;
  password: string;
}

export interface LoginResponseWithSession {
  isNewUser?: true;
  sessionToken: string;
  userId: string;
}

export interface JwtPayload {
  isNewUser?: true;
  userId: string;
  loginAt: Date;
}

export interface InternalRegisterVerifyRequest {
  provider: InternalProvider;
  account: string
}

export interface InternalRegisterRequest {
  provider: InternalProvider;
  account: string;
  password: string;
  verifyCode: string;
}