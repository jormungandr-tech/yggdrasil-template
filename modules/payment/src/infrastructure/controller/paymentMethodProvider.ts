import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {MethodProviderDbFunctions} from '../../application/functions';
import {paymentMethodProvider} from '../schema/paymentMethodProvider';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {and, eq} from 'drizzle-orm';
import {PaymentMethodProviderType} from '../../application/dto';

function insertPaymentMethodProvider<T extends Postgres>(
  db: T,
  providerType: string,
  account: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(paymentMethodProvider)
      .values({
        providerType,
        account,
      });
  });
}

function setEnabled<T extends Postgres>(
  db: T,
  id: number,
  enabled: boolean,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(paymentMethodProvider)
      .set({
        enabled,
      })
      .where(eq(paymentMethodProvider.id, id));
  });
}

function updateAccount<T extends Postgres>(
  db: T,
  id: number,
  account: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(paymentMethodProvider)
      .set({
        account,
      })
      .where(eq(paymentMethodProvider.id, id));
  });
}

function findById<T extends Postgres>(
  db: T,
  id: number,
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
  });
}

function getAllEnabled<T extends Postgres>(
  db: T,
): TaskOption<PaymentMethodProviderType[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(paymentMethodProvider)
      .where(eq(paymentMethodProvider.enabled, true));
  });
}

function getAllEnabledByProviderType<T extends Postgres>(
  db: T,
  providerType: string,
): TaskOption<PaymentMethodProviderType[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(paymentMethodProvider)
      .where(and(
        eq(paymentMethodProvider.enabled, true),
        eq(paymentMethodProvider.providerType, providerType),
      ));
  });
}

function deleteById<T extends Postgres>(
  db: T,
  id: number,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(paymentMethodProvider)
      .where(eq(paymentMethodProvider.id, id));
  });
}

export function getMethodProviderDbFunctions(db: DatabaseAccessor): MethodProviderDbFunctions {
  return {
    insertMethodProvider(providerType: string, account: string) {
      return insertPaymentMethodProvider(db(), providerType, account);
    },
    setMethodProviderEnabled(id: number, enabled: boolean) {
      return setEnabled(db(), id, enabled);
    },
    updateMethodProviderAccount(id: number, account: string) {
      return updateAccount(db(), id, account);
    },
    findMethodProviderById(id: number) {
      return findById(db(), id);
    },
    getAllEnabledMethodProviders() {
      return getAllEnabled(db());
    },
    getAllEnabledMethodProvidersByType(providerType: string) {
      return getAllEnabledByProviderType(db(), providerType);
    },
    deleteMethodProvider(id: number) {
      return deleteById(db(), id);
    },
  }
}