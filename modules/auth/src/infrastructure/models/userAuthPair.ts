import {index, pgTable, primaryKey, uuid, varchar} from 'drizzle-orm/pg-core';
import {Postgres} from '../db';
import {UserAuthRecord} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {and, eq} from 'drizzle-orm';

export const userAuthPair = pgTable('ygg_auth__user_auth_pair', {
  authProvider: varchar('auth_provider', {length: 32}).notNull(),
  authKey: varchar('auth_key', {length: 256}).notNull(),
  userId: uuid('user_id').notNull(),
}, table => ({
  reverseUserIndex: index('reverse_user_index').on(table.userId),
  primary: primaryKey({columns: [table.authKey, table.authProvider]})
}))

// =============================================================================

export function findAuthPairByUserId<T extends Postgres>(db: T, userId: string): TaskOption<UserAuthRecord[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(userAuthPair)
      .where(eq(
        userAuthPair.userId,
        userId
      ));
  })
}

export function findAuthPairByAuthKey<T extends Postgres>(
  db: T,
  authKey: string,
  authProvider: string
): TaskOption<UserAuthRecord> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(userAuthPair)
      .where(
        and(
          eq(userAuthPair.authKey, authKey),
          eq(userAuthPair.authProvider, authProvider)
        )
      );
    return result[0];
  })
}

export function insertAuthPair<T extends Postgres>(
  db: T,
  authProvider: string,
  authKey: string,
  userId: string
): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .insert(userAuthPair)
      .values({
        authProvider,
        authKey,
        userId
      })
      .onConflictDoNothing();
  })
}

export function removeAuthPair<T extends Postgres>(
  db: T,
  authProvider: string,
  authKey: string
): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(userAuthPair)
      .where(
        and(
          eq(userAuthPair.authProvider, authProvider),
          eq(userAuthPair.authKey, authKey)
        )
      );
  })
}

export function updateAuthPairKey<T extends Postgres>(
  db: T,
  authProvider: string,
  oldKey: string,
  newKey: string
): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .update(userAuthPair)
      .set({
        authKey: newKey
      })
      .where(
        and(
          eq(userAuthPair.authProvider, authProvider),
          eq(userAuthPair.authKey, oldKey)
        )
      );
  })
}

export function updateAuthPairUserId<T extends Postgres>(
  db: T,
  authProvider: string,
  authKey: string,
  newUserId: string
): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .update(userAuthPair)
      .set({
        userId: newUserId
      })
      .where(
        and(
          eq(userAuthPair.authProvider, authProvider),
          eq(userAuthPair.authKey, authKey)
        )
      );
  })
}