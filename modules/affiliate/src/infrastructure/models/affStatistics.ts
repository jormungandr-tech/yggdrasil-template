import {integer, pgTable, real, uuid} from 'drizzle-orm/pg-core';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {Postgres} from '@yggdrasil-template/base';
import {AffiliateStatistics} from '../../application/dto';
import {eq} from 'drizzle-orm';

export const affStatistics = pgTable('ygg_affiliate__statistics', {
  userId: uuid('user_id').primaryKey(),
  totalRewards: real('total_rewards').notNull().default(0),
  withdrawnRewards: real('withdrawn_rewards').notNull().default(0),
  countReferrals: integer('count_referrals').notNull().default(0),
  rate: real('rate').notNull(),
});

export function insertAffiliateStatistics<D extends Postgres>(db: D, userId: string, rate: number): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .insert(affStatistics)
      .values({
          userId,
          rate,
        },
      );
  });
}

export function findAffiliateStatistics<D extends Postgres>(db: D, userId: string): TaskOption<AffiliateStatistics> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(affStatistics)
      .where(
        eq(affStatistics.userId, userId),
      );
    if (result.length === 0) {
      return Promise.reject('Affiliate statistics not found');
    } else {
      return result[0];
    }
  });
}

export function deleteAffiliateStatistics<D extends Postgres>(db: D, userId: string): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(affStatistics)
      .where(
        eq(affStatistics.userId, userId),
      );
  });
}