import {boolean, index, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';

export const scheduledTask = pgTable('ygg_schedule__task', {
  id: serial('id').primaryKey(),
  time: timestamp('time').notNull(),
  payload: text('payload').notNull(),
  consumed: boolean('consumed').notNull().default(false),
  consumer: text('consumer').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, table => ({
  timeIndex: index('time_index').on(table.time),
}));