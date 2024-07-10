import {boolean, index, integer, json, pgTable, real, serial, text, varchar} from 'drizzle-orm/pg-core';
import {Postgres} from '@yggdrasil-template/base';
import {Production, ProductionStockChange} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {arrayContains, eq, ilike, sql} from 'drizzle-orm';

const production = pgTable('ygg_shop__production', {
  id: serial('id').primaryKey(),
  name: varchar('name', {length: 512}).notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull(),
  lockedStock: integer('lockedStock').notNull().default(0),
  productionType: varchar('production_type', {length: 256}).notNull(),
  infinityStock: boolean('infinity_stock').notNull().default(false),
  description: text('description').notNull(),
  content: json('content').notNull(),
  labels: varchar('labels', {length: 256}).array().notNull().default([]),
}, table => ({
  nameIndex: index('name_index').on(table.name),
  labelsIndex: index('labels_index').on(table.labels),
  productionTypeIndex: index('production_type_index').on(table.productionType),
}));

export function insertProduction<D extends Postgres, C>(db: D, productionItem: Omit<Production<C>, 'id'>): TaskOption<Production<C>> {
  return tryCatch(async () => {
    return await db
      .insert(production)
      .values(productionItem);
  });
}

export function findProductionById<D extends Postgres, C>(db: D, id: number): TaskOption<Production<C>> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(production)
      .where(eq(
        production.id,
        id,
      ));
    if (result.length === 0) {
      return Promise.reject('Production not found');
    } else {
      return {
        ...result[0],
        content: result[0].content as C,
      };
    }
  });
}

export function findProductionByExactName<D extends Postgres>(db: D, exactName: string): TaskOption<Production<unknown>[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(production)
      .where(eq(
        production.name,
        exactName,
      ));
  });
}

export function findProductionByFuseName<D extends Postgres>(db: D, fuseName: string, limit: number, offset: number): TaskOption<Production<unknown>[]> {
  return tryCatch(() => {
    return db.select()
      .from(production)
      .where(
        ilike(production.name, `%${fuseName}%`),
      )
      .limit(limit)
      .offset(offset);
  });
}

export function findProductionByLabelContains<D extends Postgres>(db: D, labels: string[], limit: number, offset: number): TaskOption<Production<unknown>[]> {
  return tryCatch(() => {
    return db.select()
      .from(production)
      .where(
        arrayContains(production.labels, labels),
      )
      .limit(limit)
      .offset(offset);
  });
}

export function updateProduction<D extends Postgres, C>(db: D, id: number, productionItem: Omit<Production<C>, 'id'>): TaskOption<Production<C>> {
  return tryCatch(() => {
    return db
      .update(production)
      .set(productionItem)
      .where(eq(
        production.id,
        id,
      ));
  });
}

export function updateProductionStock<D extends Postgres>(db: D, id: number, stock: number, lockedStock: number): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(production)
      .set({
        stock,
        lockedStock,
      })
      .where(eq(
        production.id,
        id,
      ));
  });
}

export function deleteProductionById<D extends Postgres>(db: D, id: number): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(production)
      .where(eq(
        production.id,
        id,
      ));
  });
}

export function productionStockChangeByBatch<D extends Postgres>(db: D, changes: readonly ProductionStockChange[]): TaskOption<void> {
  return tryCatch(() => {
    return db.transaction(async (tx) => {
      for(const change of changes) {
        const lockedStockString = change.lockedStock < 0 ? sql`${production.lockedStock} - ${-change.lockedStock}` : sql`${production.lockedStock} + ${change.lockedStock}`
        const stockString = change.stock < 0 ? sql`${production.stock} - ${-change.stock}` : sql`${production.stock} + ${change.stock}`
        await tx
          .update(production)
          .set({
            lockedStock: lockedStockString,
            stock: stockString
          })
          .where(eq(production.id, change.id))
      }
    })
  })
}