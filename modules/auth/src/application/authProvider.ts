import {Postgres} from '../infrastructure/db';
import {TaskOption} from 'fp-ts/TaskOption';
import {UserAuthRecord} from './dto';
import {IO} from 'fp-ts/IO';

export interface AuthProvider<InstanceType, Database extends Postgres, AuthAccount> {
  __instance: InstanceType;
  __db: Database;
  __authProviderName: string;
  tryLogin(key: AuthAccount): TaskOption<UserAuthRecord>;
  register(key: AuthAccount, userId: string): TaskOption<UserAuthRecord>;
  findAuthAccount(userId: string): TaskOption<AuthAccount>;
  changeAuthAccount(userId: string, newAccount: AuthAccount): TaskOption<UserAuthRecord>;
}

export interface VerifyCodeRequiredAuthProvider<InstanceType, Database extends Postgres, AuthAccount>
  extends AuthProvider<InstanceType, Database, AuthAccount> {
  setVerified(userId: string, isVerified: boolean): TaskOption<void>;
  sendVerifyMessage(userId: string, account: AuthAccount, code: string): TaskOption<void>;
  generateVerifyCode(userId: string): IO<string>
  setVerifyCode(userId: string, verifyCode: string): TaskOption<void>;
  compareVerifyCode(userId: string, verifyCode: string): TaskOption<boolean>;
}

export interface AuthProviderFactory<AuthAccount, InstanceType, Database extends Postgres> {
  (instance: InstanceType, db: Database): AuthProvider<InstanceType, Database, AuthAccount>;
}