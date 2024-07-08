import * as M from '../models/invoice'
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {InvoiceDbFunctions} from '../../application/functions';

export function getInvoiceDbFunctions(db: DatabaseAccessor): InvoiceDbFunctions {
  return {
    insertInvoice: (orderId, amount, externalProductName) => M.insertInvoice(db(), orderId, amount, externalProductName),
    updateInvoiceStatus: (invoiceId, status) => M.updateInvoiceStatus(db(), invoiceId, status),
    updateInvoicePaymentMethod: (invoiceId, paymentMethod) => M.updateInvoicePaymentMethod(db(), invoiceId, paymentMethod),
    updateInvoiceAmount: (invoiceId, amount) => M.updateInvoiceAmount(db(), invoiceId, amount),
    deleteInvoice: (invoiceId) => M.deleteInvoice(db(), invoiceId),
    findInvoiceById: (invoiceId) => M.findInvoiceById(db(), invoiceId),
    findInvoiceByOrderId: (orderId) => M.findInvoiceByOrderId(db(), orderId),
  };
}