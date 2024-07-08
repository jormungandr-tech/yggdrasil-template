import {boolean, index, json, numeric, pgEnum, pgTable, text, timestamp, uuid} from 'drizzle-orm/pg-core';
import {Postgres} from '@yggdrasil-template/base';
import {OrderRecord, OrderStatus} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {eq} from 'drizzle-orm';

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

export function insertOrder<D extends Postgres, C>(
  db: D,
  userId: string,
  amount: string,
  productName: string,
  content: C
): TaskOption<OrderRecord<C>> {
  return tryCatch(() => {
    return db
      .insert(orders)
      .values({
        userId,
        amount,
        productName,
        content
      });
  })
}

export function findOrderByOrderId<D extends Postgres, C>(
  db: D,
  orderId: string
): TaskOption<OrderRecord<C>> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(orders)
      .where(
        eq(orders.orderId, orderId)
      );
    if (result.length === 0) {
      return Promise.reject('Order not found');
    } else {
      return {
        ...result[0],
        content: result[0].content as C
      };
    }
  })
}

export function findOrderByUserId<D extends Postgres>(
  db: D,
  userId: string
): TaskOption<OrderRecord<unknown>[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(orders)
      .where(
        eq(orders.userId, userId)
      );
  })
}

export function updateOrderStatus<D extends Postgres>(
  db: D,
  orderId: string,
  status: OrderStatus
): TaskOption<void> {
  return tryCatch(() => {
    switch (status) {
      case 'pending':
        return db
          .update(orders)
          .set({
            status: 'pending',
            paidAt: null,
            completedAt: null
          })
          .where(eq(orders.orderId, orderId));
      case 'paid':
        return db
          .update(orders)
          .set({
            status: 'paid',
            paidAt: new Date()
          })
          .where(eq(orders.orderId, orderId));
      case 'completed':
        return db
          .update(orders)
          .set({
            status: 'completed',
            completedAt: new Date()
          })
          .where(eq(orders.orderId, orderId));
      case 'cancelled':
        return db
          .update(orders)
          .set({
            status: 'cancelled',
            completedAt: new Date()
          })
          .where(eq(orders.orderId, orderId));
    }
  })
}

export function fakeDeleteOrder<D extends Postgres>(
  db: D,
  orderId: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(orders)
      .set({
        isDeleted: true
      })
      .where(eq(orders.orderId, orderId));
  })
}

export function deleteOrderByOrderId<D extends Postgres>(
  db: D,
  orderId: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(orders)
      .where(eq(orders.orderId, orderId));
  })
}