import {boolean, pgTable, serial, text} from 'drizzle-orm/pg-core';

export const paymentMethodProvider = pgTable('ygg_payment__payment_method_provider', {
  id: serial('id').primaryKey(),
  providerType: text('provider_type').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  account: text('account').notNull(),
})