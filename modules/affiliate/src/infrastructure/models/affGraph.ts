import {index, pgTable, real, serial, timestamp, uuid} from 'drizzle-orm/pg-core';
import {Postgres} from '../db';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {AffiliateGraph} from '../../application/dto';
import {eq} from 'drizzle-orm';

export const affGraph = pgTable('ygg_affiliate__graph', {
  id: serial('id').primaryKey(),
  from: uuid('from').notNull(),
  to: uuid('to').notNull(),
  reward: real('reward').notNull(),
  rate: real('rate').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, table => ({
  fromIndex: index('from_index').on(table.from),
  toIndex: index('to_index').on(table.to),
}));

export function insertAffiliateRelation<D extends Postgres>
(
  db: D,
  from: string,
  to: string,
  reward: number,
  rate: number,
): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .insert(affGraph)
      .values({
          from,
          to,
          reward,
          rate,
        },
      );
  });
}

export function findAffiliateRelationById<D extends Postgres>(db: D, id: number): TaskOption<AffiliateGraph> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(affGraph)
      .where(
        eq(affGraph.id, id),
      );
    if (result.length === 0) {
      return Promise.reject('Affiliate relation not found');
    } else {
      return result[0];
    }
  });
}

export function findAffiliateRelationByFrom<D extends Postgres>(db: D, from: string): TaskOption<AffiliateGraph[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(affGraph)
      .where(
        eq(affGraph.from, from),
      );
  });
}

export function findAffiliateRelationByTo<D extends Postgres>(db: D, to: string): TaskOption<AffiliateGraph[]> {
  return tryCatch(async () => {
    return db
      .select()
      .from(affGraph)
      .where(
        eq(affGraph.to, to),
      );
  });
}

export function deleteAffiliateRelationById<D extends Postgres>(db: D, id: number): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(affGraph)
      .where(
        eq(affGraph.id, id),
      );
  });
}

export function deleteAffiliateRelationByFrom<D extends Postgres>(db: D, from: string): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(affGraph)
      .where(
        eq(affGraph.from, from),
      );
  });
}

export function deleteAffiliateRelationByTo<D extends Postgres>(db: D, to: string): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(affGraph)
      .where(
        eq(affGraph.to, to),
      );
  });
}