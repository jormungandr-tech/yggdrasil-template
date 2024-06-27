import {index, numeric, pgEnum, pgTable, serial, text, uuid} from 'drizzle-orm/pg-core';
import {Postgres} from '../db';
import {UserBalanceChangeLog, UserBalanceChangeType} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {eq} from 'drizzle-orm';

export const userBalanceChangeTypeEnum = pgEnum(
  'user_balance_change_type',
  [
    'deposit', 'withdraw', 'refund', 'chargeback', 'lock', 'unlock'
  ]
)

export const userBalanceChange = pgTable('ygg_payment__user_balance_change', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  amount: numeric('amount').notNull(),
  type: userBalanceChangeTypeEnum('type').notNull(),
  reason: text('reason').notNull()
}, table => ({
  userIndex: index('user_index').on(table.userId)
}))

export function insertUserBalanceChange<T extends Postgres>(
  db: T,
  userId: string,
  amount: string,
  type: UserBalanceChangeType,
  reason: string = ''
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(userBalanceChange)
      .values({
        userId,
        amount,
        type,
        reason
      });
  })
}

export function findUserBalanceChangeByUserId<T extends Postgres>(db: T, userId: string): TaskOption<UserBalanceChangeLog[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(userBalanceChange)
      .where(eq(userBalanceChange.userId, userId));
  })
}

export function findUserBalanceChangeById<T extends Postgres>(db: T, id: number): TaskOption<UserBalanceChangeLog> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(userBalanceChange)
      .where(eq(userBalanceChange.id, id));
    return result[0];
  })
}

export function deleteUserBalanceChange<T extends Postgres>(db: T, id: number): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(userBalanceChange)
      .where(eq(userBalanceChange.id, id));
  })
}