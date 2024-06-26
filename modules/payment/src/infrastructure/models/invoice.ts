import {index, numeric, pgEnum, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import {ordersFunc} from './orders';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {Postgres} from '../db';
import {InvoiceRecord, InvoiceStatus} from '../../application/dto';
import {eq} from 'drizzle-orm';

export const invoiceStatusEnum = pgEnum('invoice_status', ['unpaid', 'paid', 'cancelled', 'fraud'])

export const invoice = pgTable('invoice', {
  invoiceId: uuid('invoice_id').notNull().primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => ordersFunc<unknown>().orderId),
  amount: numeric('amount').notNull(),
  externalProductName: text('external_product_name').notNull(),
  paymentMethod: text('payment_method'),
  status: invoiceStatusEnum('status').notNull().default('unpaid'),
  createAt: timestamp('create_at').notNull().defaultNow(),
  updateAt: timestamp('update_at').notNull().defaultNow(),
}, table => ({
  orderIdIndex: index('order_id_index').on(table.orderId),
}))

export function insertInvoice<T extends Postgres>(
  db: T,
  orderId: string,
  amount: string,
  externalProductName: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(invoice)
      .values({
        orderId,
        amount,
        externalProductName,
      });
  })
}

export function updateInvoiceStatus<T extends Postgres>(
  db: T,
  invoiceId: string,
  status: InvoiceStatus
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(invoice)
      .set({
        status,
        updateAt: new Date(),
      })
      .where(eq(invoice.invoiceId, invoiceId))
  })
}

export function deleteInvoice<T extends Postgres>(db: T, invoiceId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(invoice)
      .where(eq(invoice.invoiceId, invoiceId))
  })
}

export function findInvoiceById<T extends Postgres>(db: T, invoiceId: string): TaskOption<InvoiceRecord> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(invoice)
      .where(eq(invoice.invoiceId, invoiceId));
    if (result.length === 0) {
      return Promise.reject('Invoice not found');
    } else {
      return result[0];
    }
  })
}

export function findInvoiceByOrderId<T extends Postgres>(db: T, orderId: string): TaskOption<InvoiceRecord[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(invoice)
      .where(eq(invoice.orderId, orderId));
  })
}