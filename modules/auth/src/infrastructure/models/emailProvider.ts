import {boolean, pgTable, text, timestamp, uniqueIndex, uuid, varchar} from 'drizzle-orm/pg-core';
import {EmailAuthProviderRecord} from '../../application/dto';
import {Postgres} from '../db';
import {eq} from 'drizzle-orm';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';

export const emailProvider = pgTable('ygg_auth__email_provider', {
  email: varchar('email', {length: 512}).unique().primaryKey(),
  passwordHash: text('password_hash').notNull(),
  authKey: uuid('auth_key').notNull().unique().defaultRandom(),
  verifyCode: varchar('verify_code', {length: 8}),
  verifyCodeSentAt: timestamp('verify_code_sent_at'),
  verified: boolean('verified').notNull().default(false),
  verifiedAt: timestamp('verified_at'),
}, table => ({
  authKeyIndex: uniqueIndex('auth_key_index').on(table.authKey)
}))

// =============================================================================

export function emailProviderRecordFactory(
  email: string,
  passwordHash: string,
): Omit<EmailAuthProviderRecord, 'authKey'> {
  return {
    email,
    passwordHash,
    verifyCode: null,
    verifyCodeSentAt: null,
    verified: false,
    verifiedAt: null
  };
}

export function setEmailIsVerified<T extends Postgres>(
  db: T,
  email: string,
  isVerified: boolean
): Promise<void> {
  return db
    .update(emailProvider)
    .set({
      verified: isVerified,
      verifiedAt: isVerified ? new Date() : null
    })
    .where(
      eq(emailProvider.email, email)
    );
}

export function setVerifyCode<T extends Postgres>(
  db: T,
  email: string,
  verifyCode: string
): Promise<void> {
  return db
    .update(emailProvider)
    .set({
      verifyCode,
      verifyCodeSentAt: new Date()
    })
    .where(
      eq(emailProvider.email, email)
    );
}

export function findUserByEmail<T extends Postgres>(
  db: T,
  email: string
): TaskOption<EmailAuthProviderRecord> {
  return tryCatch(async () => {
    const record = await db
      .select()
      .from(emailProvider)
      .where(
        eq(emailProvider.email, email)
      );
    if (record.length === 0) {
      return Promise.reject();
    } else {
      return record[0];
    }
  })
}