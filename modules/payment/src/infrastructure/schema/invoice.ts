import {pgTable, uuid, numeric, text, timestamp, index, pgEnum} from 'drizzle-orm/pg-core';

export const invoiceStatusEnum = pgEnum('ygg_payment__invoice_status', ['unpaid', 'paid', 'cancelled', 'fraud', 'refunded'])

export const invoice = pgTable('ygg_payment__invoice', {
  invoiceId: uuid('invoice_id').notNull().primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull(),
  amount: numeric('amount').notNull(),
  externalProductName: text('external_product_name').notNull(),
  paymentMethod: text('payment_method'),
  status: invoiceStatusEnum('status').notNull().default('unpaid'),
  createAt: timestamp('create_at').notNull().defaultNow(),
  updateAt: timestamp('update_at').notNull().defaultNow(),
}, table => ({
  orderIdIndex: index('order_id_index').on(table.orderId),
}));