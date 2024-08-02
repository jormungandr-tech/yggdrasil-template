import {numeric, pgTable, uuid} from 'drizzle-orm/pg-core';

export const userBalance = pgTable('ygg_payment__user_balance', {
  userId: uuid('user_id').notNull().primaryKey(),
  availableBalance: numeric('available_balance').notNull().default('0'),
  reservedBalance: numeric('reserved_balance').notNull().default('0'),
})