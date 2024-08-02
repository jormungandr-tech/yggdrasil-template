import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {InvoiceDbFunctions} from '../../application/functions';
import {InvoiceRecord, InvoiceStatus} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {invoice} from '../schema/invoice';
import {eq} from 'drizzle-orm';

function insertInvoice<T extends Postgres>(
  db: T,
  orderId: string,
  amount: string,
  externalProductName: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(invoice)
      .values({
        orderId,
        amount,
        externalProductName,
      });
  });
}

function updateInvoiceStatus<T extends Postgres>(
  db: T,
  invoiceId: string,
  status: InvoiceStatus,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(invoice)
      .set({
        status,
        updateAt: new Date(),
      })
      .where(eq(invoice.invoiceId, invoiceId));
  });
}

function updateInvoicePaymentMethod<T extends Postgres>(
  db: T,
  invoiceId: string,
  paymentMethod: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(invoice)
      .set({
        paymentMethod,
        updateAt: new Date(),
      })
      .where(eq(invoice.invoiceId, invoiceId));
  });
}

function updateInvoiceAmount<T extends Postgres>(
  db: T,
  invoiceId: string,
  amount: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(invoice)
      .set({
        amount,
        updateAt: new Date(),
      })
      .where(eq(invoice.invoiceId, invoiceId));
  });
}

function deleteInvoice<T extends Postgres>(db: T, invoiceId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(invoice)
      .where(eq(invoice.invoiceId, invoiceId));
  });
}

function findInvoiceById<T extends Postgres>(db: T, invoiceId: string): TaskOption<InvoiceRecord> {
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
  });
}

function findInvoiceByOrderId<T extends Postgres>(db: T, orderId: string): TaskOption<InvoiceRecord[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(invoice)
      .where(eq(invoice.orderId, orderId));
  });
}

export function getInvoiceDbFunctions(db: DatabaseAccessor): InvoiceDbFunctions {
  return {
    insertInvoice: (orderId, amount, externalProductName) => insertInvoice(db(), orderId, amount, externalProductName),
    updateInvoiceStatus: (invoiceId, status) => updateInvoiceStatus(db(), invoiceId, status),
    updateInvoicePaymentMethod: (invoiceId, paymentMethod) => updateInvoicePaymentMethod(db(), invoiceId, paymentMethod),
    updateInvoiceAmount: (invoiceId, amount) => updateInvoiceAmount(db(), invoiceId, amount),
    deleteInvoice: (invoiceId) => deleteInvoice(db(), invoiceId),
    findInvoiceById: (invoiceId) => findInvoiceById(db(), invoiceId),
    findInvoiceByOrderId: (orderId) => findInvoiceByOrderId(db(), orderId),
  };
}