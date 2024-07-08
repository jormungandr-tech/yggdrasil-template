import {TaskOption} from 'fp-ts/TaskOption';
import {
  InvoiceRecord,
  InvoiceStatus, OrderRecord, OrderStatus,
  PaymentMethodProviderType,
  UserBalanceChangeLog,
  UserBalanceChangeType,
  UserBalanceRecord,
} from './dto';

export interface InvoiceDbFunctions {
  insertInvoice(orderId: string, amount: string, externalProductName: string): TaskOption<void>;
  updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): TaskOption<void>;
  updateInvoicePaymentMethod(invoiceId: string, paymentMethod: string): TaskOption<void>;
  updateInvoiceAmount(invoiceId: string, amount: string): TaskOption<void>;
  deleteInvoice(invoiceId: string): TaskOption<void>;
  findInvoiceById(invoiceId: string): TaskOption<InvoiceRecord>;
  findInvoiceByOrderId(orderId: string): TaskOption<InvoiceRecord[]>;
}

export interface UserBalanceDbFunctions {
  findUserBalance(userId: string): TaskOption<UserBalanceRecord>;
  insertUserBalance(userId: string): TaskOption<void>;
  updateUserBalance(userId: string, availableBalance: string, reservedBalance: string): TaskOption<void>;
  updateAvailableBalance(userId: string, availableBalance: string): TaskOption<void>;
  updateReservedBalance(userId: string, reservedBalance: string): TaskOption<void>;
  deleteUserBalance(userId: string): TaskOption<void>;
}

export interface UserBalanceChangeLogDbFunctions {
  insertUserBalanceChangeLog(userId: string, amount: string, changeType: UserBalanceChangeType, reason: string): TaskOption<void>;
  findUserBalanceChangeLogById(id: number): TaskOption<UserBalanceChangeLog>;
  findUserBalanceChangeLogByUserId(
    userId: string,
    limit: number,
    offset: number
  ): TaskOption<UserBalanceChangeLog[]>;
  deleteOneUserBalanceChangeLog(id: number): TaskOption<void>;
  deleteAllUserBalanceChangeLog(userId: string): TaskOption<void>;
}

export interface MethodProviderDbFunctions {
  insertMethodProvider(providerType: string, account: string): TaskOption<void>;
  setMethodProviderEnabled(id: number, enabled: boolean): TaskOption<void>;
  updateMethodProviderAccount(id: number, account: string): TaskOption<void>;
  findMethodProviderById(id: number): TaskOption<PaymentMethodProviderType>;
  getAllEnabledMethodProviders(): TaskOption<PaymentMethodProviderType[]>;
  getAllEnabledMethodProvidersByType(providerType: string): TaskOption<PaymentMethodProviderType[]>;
  deleteMethodProvider(id: number): TaskOption<void>;
}

export interface OrderDbFunctions {
  insertOrder<C>(userId: string, amount: string, productName: string, content: C): TaskOption<OrderRecord<C>>;
  findOrderByOrderId<C>(orderId: string): TaskOption<OrderRecord<C>>;
  findOrderByUserId(userId: string): TaskOption<OrderRecord<unknown>[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): TaskOption<void>;
  fakeDeleteOrder(orderId: string): TaskOption<void>;
  deleteOrder(orderId: string): TaskOption<void>;
}

export interface PaymentDbFunctions extends
  InvoiceDbFunctions,
  UserBalanceDbFunctions,
  UserBalanceChangeLogDbFunctions,
  OrderDbFunctions,
  MethodProviderDbFunctions
{}

