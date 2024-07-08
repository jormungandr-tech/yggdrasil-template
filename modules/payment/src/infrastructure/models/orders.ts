import {boolean, index, json, numeric, pgEnum, pgTable, timestamp, uuid} from 'drizzle-orm/pg-core';
import {Postgres} from '@yggdrasil-template/base';
import {OrderRecord} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {eq} from 'drizzle-orm';

export const orderStatusEnum = pgEnum('ygg_payment__order_status', ['pending', 'paid', 'completed', 'cancelled'])

export const ordersFunc = <C>() => pgTable('ygg_payment__orders', {
  orderId: uuid('order_id').notNull().primaryKey().defaultRandom(),
  content: json('content').notNull().$type<C>(),
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
  content: C
): TaskOption<OrderRecord<C>> {
  return tryCatch(() => {
    const orders = ordersFunc<C>();
    return db
      .insert(orders)
      .values({
        userId,
        amount,
        content
      });
  })
}

export function findOrderByOrderId<D extends Postgres, C>(
  db: D,
  orderId: string
): TaskOption<OrderRecord<C>> {
  return tryCatch(async () => {
    const orders = ordersFunc<C>();
    const result = await db
      .select()
      .from(orders)
      .where(
        eq(orders.orderId, orderId)
      );
    if (result.length === 0) {
      return Promise.reject('Order not found');
    } else {
      return result[0];
    }
  })
}

export function findOrderByUserId<D extends Postgres, C>(
  db: D,
  userId: string
): TaskOption<OrderRecord<C>[]> {
  return tryCatch(() => {
    const orders = ordersFunc<C>();
    return db
      .select()
      .from(orders)
      .where(
        eq(orders.userId, userId)
      );
  })
}

export function updateOrderStatus<D extends Postgres, C>(
  db: D,
  orderId: string,
  status: 'pending' | 'paid' | 'completed' | 'cancelled'
): TaskOption<void> {
  return tryCatch(() => {
    const orders = ordersFunc<C>();
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

export function fakeDeleteOrder<D extends Postgres, C>(
  db: D,
  orderId: string
): TaskOption<void> {
  return tryCatch(() => {
    const orders = ordersFunc<C>();
    return db
      .update(orders)
      .set({
        isDeleted: true
      })
      .where(eq(orders.orderId, orderId));
  })
}

export function deleteOrderByOrderId<D extends Postgres, C>(
  db: D,
  orderId: string
): TaskOption<void> {
  return tryCatch(() => {
    const orders = ordersFunc<C>();
    return db
      .delete(orders)
      .where(eq(orders.orderId, orderId));
  })
}