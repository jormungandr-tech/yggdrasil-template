import {orders} from '../schema/orders';
import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {OrderDbFunctions} from '../../application/functions';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {OrderRecord, OrderStatus} from '../../application/dto';
import {eq} from 'drizzle-orm';

function insertOrder<D extends Postgres, C>(
  db: D,
  userId: string,
  amount: string,
  productName: string,
  content: C,
): TaskOption<OrderRecord<C>> {
  return tryCatch(() => {
    return db
      .insert(orders)
      .values({
        userId,
        amount,
        productName,
        content,
      });
  });
}

function findOrderByOrderId<D extends Postgres, C>(
  db: D,
  orderId: string,
): TaskOption<OrderRecord<C>> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(orders)
      .where(
        eq(orders.orderId, orderId),
      );
    if (result.length === 0) {
      return Promise.reject('Order not found');
    } else {
      return {
        ...result[0],
        content: result[0].content as C,
      };
    }
  });
}

function findOrderByUserId<D extends Postgres>(
  db: D,
  userId: string,
): TaskOption<OrderRecord<unknown>[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(orders)
      .where(
        eq(orders.userId, userId),
      );
  });
}

function updateOrderStatus<D extends Postgres>(
  db: D,
  orderId: string,
  status: OrderStatus,
): TaskOption<void> {
  return tryCatch(() => {
    switch (status) {
      case 'pending':
        return db
          .update(orders)
          .set({
            status: 'pending',
            paidAt: null,
            completedAt: null,
          })
          .where(eq(orders.orderId, orderId));
      case 'paid':
        return db
          .update(orders)
          .set({
            status: 'paid',
            paidAt: new Date(),
          })
          .where(eq(orders.orderId, orderId));
      case 'completed':
        return db
          .update(orders)
          .set({
            status: 'completed',
            completedAt: new Date(),
          })
          .where(eq(orders.orderId, orderId));
      case 'cancelled':
        return db
          .update(orders)
          .set({
            status: 'cancelled',
            completedAt: new Date(),
          })
          .where(eq(orders.orderId, orderId));
    }
  });
}

function fakeDeleteOrder<D extends Postgres>(
  db: D,
  orderId: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(orders)
      .set({
        isDeleted: true,
      })
      .where(eq(orders.orderId, orderId));
  });
}

function deleteOrderByOrderId<D extends Postgres>(
  db: D,
  orderId: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(orders)
      .where(eq(orders.orderId, orderId));
  });
}

export function getOrderDbFunctions(db: DatabaseAccessor): OrderDbFunctions {
  return {
    insertOrder: (userId, amount, productName, content) => insertOrder(db(), userId, amount, productName, content),
    findOrderByOrderId: orderId => findOrderByOrderId(db(), orderId),
    findOrderByUserId: userId => findOrderByUserId(db(), userId),
    updateOrderStatus: (orderId, status) => updateOrderStatus(db(), orderId, status),
    fakeDeleteOrder: orderId => fakeDeleteOrder(db(), orderId),
    deleteOrder: orderId => deleteOrderByOrderId(db(), orderId)
  }
}