import {boolean, pgTable, serial, text} from 'drizzle-orm/pg-core';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {Postgres} from '@yggdrasil-template/base';
import {and, eq} from 'drizzle-orm';
import {PaymentMethodProviderType} from '../../application/dto';

export const paymentMethodProvider = pgTable('ygg_payment__payment_method_provider', {
  id: serial('id').primaryKey(),
  providerType: text('provider_type').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  account: text('account').notNull(),
})

export function insertPaymentMethodProvider<T extends Postgres>(
  db: T,
  providerType: string,
  account: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(paymentMethodProvider)
      .values({
        providerType,
        account,
      });
  })
}

export function setEnabled<T extends Postgres>(
  db: T,
  id: number,
  enabled: boolean
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(paymentMethodProvider)
      .set({
        enabled,
      })
      .where(eq(paymentMethodProvider.id, id))
  })
}

export function updateAccount<T extends Postgres>(
  db: T,
  id: number,
  account: string
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(paymentMethodProvider)
      .set({
        account,
      })
      .where(eq(paymentMethodProvider.id, id))
  })
}

export function findById<T extends Postgres>(
  db: T,
  id: number
): TaskOption<PaymentMethodProviderType> {
  return tryCatch(async () => {
    const items = await db
      .select()
      .from(paymentMethodProvider)
      .where(eq(paymentMethodProvider.id, id));
    if (items.length === 0) {
      return Promise.reject('Payment method provider not found');
    } else {
      return items[0];
    }
  })
}

export function getAllEnabled<T extends Postgres>(
  db: T
): TaskOption<PaymentMethodProviderType[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(paymentMethodProvider)
      .where(eq(paymentMethodProvider.enabled, true));
  })
}

export function getAllEnabledByProviderType<T extends Postgres>(
  db: T,
  providerType: string
): TaskOption<PaymentMethodProviderType[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(paymentMethodProvider)
      .where(and(
        eq(paymentMethodProvider.enabled, true),
        eq(paymentMethodProvider.providerType, providerType)
      ));
  })
}

export function deleteById<T extends Postgres>(
  db: T,
  id: number
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(paymentMethodProvider)
      .where(eq(paymentMethodProvider.id, id))
  })
}