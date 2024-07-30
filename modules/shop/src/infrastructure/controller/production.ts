import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {DbFunctions} from '../../application/functions';
import {production} from '../schema/production';
import {Production, ProductionStockChange} from '../../application/dto';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {arrayContains, eq, ilike, sql} from 'drizzle-orm';

export function insertProduction<D extends Postgres, C>(db: D, productionItem: Omit<Production<C>, 'id'>): TaskOption<Production<C>> {
  return tryCatch(async () => {
    return await db
      .insert(production)
      .values(productionItem);
  });
}

export function listAllProductions<D extends Postgres>(db: D, limit: number, offset: number): TaskOption<Production<unknown>[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(production)
      .limit(limit)
      .offset(offset);
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
      for (const change of changes) {
        const lockedStockString = change.lockedStock < 0 ? sql`${production.lockedStock} - ${-change.lockedStock}` : sql`${production.lockedStock} + ${change.lockedStock}`;
        const stockString = change.stock < 0 ? sql`${production.stock} - ${-change.stock}` : sql`${production.stock} + ${change.stock}`;
        await tx
          .update(production)
          .set({
            lockedStock: lockedStockString,
            stock: stockString,
          })
          .where(eq(production.id, change.id));
      }
    });
  });
}

export function getDbFunctions(db: DatabaseAccessor): DbFunctions {
  return {
    insertProduction: (productionItem) => insertProduction(db(), productionItem),
    listAllProductions: (limit, offset) => listAllProductions(db(), limit, offset),
    findProductionById: (id) => findProductionById(db(), id),
    findProductionByExactName: (exactName) => findProductionByExactName(db(), exactName),
    findProductionByFuseName: (fuseName, limit, offset) => findProductionByFuseName(db(), fuseName, limit, offset),
    findProductionByLabelContains: (labels, limit, offset) => findProductionByLabelContains(db(), labels, limit, offset),
    updateProductionStock: (id, stock, lockedStock) => updateProductionStock(db(), id, stock, lockedStock),
    updateProduction: (id, productionItem) => updateProduction(db(), id, productionItem),
    deleteProduction: (id) => deleteProductionById(db(), id),
    productionStockChangeByBatch: (changes) => productionStockChangeByBatch(db(), changes)
  }
}