import {boolean, index, json, numeric, pgEnum, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';

export const orderStatusEnum = pgEnum('ygg_payment__order_status', ['pending', 'paid', 'completed', 'cancelled'])

export const orders =  pgTable('ygg_payment__orders', {
  orderId: uuid('order_id').notNull().primaryKey().defaultRandom(),
  productName: text('product_name').notNull(),
  content: json('content').notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  userId: uuid('user_id').notNull(),
  amount: numeric('amount').notNull(),
  createAt: timestamp('create_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
  completedAt: timestamp('completed_at'),
  isDeleted: boolean('is_deleted').notNull().default(false)
}, table => ({
  userIdIndex: index('user_id_index').on(table.userId)
}))