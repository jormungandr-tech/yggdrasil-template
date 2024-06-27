import {numeric, pgTable, uuid} from 'drizzle-orm/pg-core';
import {Postgres} from '../db';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {eq} from 'drizzle-orm';
import {UserBalanceRecord} from '../../application/dto';

export const userBalance = pgTable('ygg_payment__user_balance', {
  userId: uuid('user_id').notNull().primaryKey(),
  availableBalance: numeric('available_balance').notNull().default('0'),
  reservedBalance: numeric('reserved_balance').notNull().default('0'),
})

// =============================================================================

export function findUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<UserBalanceRecord> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(userBalance)
      .where(eq(userBalance.userId, userId));
    if (result.length === 0) {
      return Promise.reject('User balance not found');
    } else {
      return result[0];
    }
  })
}

export function insertUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(userBalance)
      .values({
        userId,
      });
  })
}

export function updateUserBalance<T extends Postgres>(
  db: T,
  userId: string,
  availableBalance: string,
  reservedBalance: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        availableBalance,
        reservedBalance,
      })
      .where(eq(userBalance.userId, userId));
  })
}

export function updateAvailableBalance<T extends Postgres>(db: T, userId: string, availableBalance: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        availableBalance,
      })
      .where(eq(userBalance.userId, userId));
  })
}

export function updateReservedBalance<T extends Postgres>(db: T, userId: string, reservedBalance: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        reservedBalance,
      })
      .where(eq(userBalance.userId, userId));
  })
}

export function deleteUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(userBalance)
      .where(eq(userBalance.userId, userId));
  })
}