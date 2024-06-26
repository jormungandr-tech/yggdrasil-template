export interface UserBalanceRecord {
  userId: string;
  availableBalance: string;
  reservedBalance: string;
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface OrderRecord<T> {
  orderId: string;
  content: T;
  status: OrderStatus;
  userId: string;
  amount: string;
  createAt: Date;
  paidAt: Date | null;
  completedAt: Date | null;
  isDeleted: boolean;
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'cancelled' | 'fraud'

export interface InvoiceRecord {
  invoiceId: string;
  orderId: string;
  amount: string;
  externalProductName: string;
  paymentMethod: string | null;
  status: InvoiceStatus;
  createAt: Date;
  updateAt: Date;
}

export type UserBalanceChangeType = 'deposit' | 'withdraw' | 'refund' | 'chargeback' | 'lock' | 'unlock';

export interface UserBalanceChangeLog {
  id: number;
  userId: string;
  amount: string;
  type: UserBalanceChangeType;
  reason: string;
}