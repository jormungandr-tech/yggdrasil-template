import {boolean, index, integer, json, pgTable, real, serial, text, varchar} from 'drizzle-orm/pg-core';

export const production = pgTable('ygg_shop__production', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 512}).notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull(),
  lockedStock: integer('lockedStock').notNull().default(0),
  productionType: varchar('production_type', {length: 256}).notNull(),
  infinityStock: boolean('infinity_stock').notNull().default(false),
  description: text('description').notNull(),
  content: json('content').notNull(),
  labels: varchar('labels', {length: 256}).array().default([]).notNull(),
}, table => ({
  nameIndex: index('name_index').on(table.name),
  labelsIndex: index('labels_index').on(table.labels),
  productionTypeIndex: index('production_type_index').on(table.productionType),
}));

