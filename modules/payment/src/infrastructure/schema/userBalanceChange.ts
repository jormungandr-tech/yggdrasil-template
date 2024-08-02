import {index, numeric, pgEnum, pgTable, serial, text, uuid} from 'drizzle-orm/pg-core';

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