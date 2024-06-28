import {boolean, index, pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';
import {Postgres} from '../db';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {MAGIC_EVENT_TIMESTAMP, ScheduledEvent} from '../../application/dto';
import {and, eq, gte, lte} from 'drizzle-orm';

export const scheduledTask = pgTable('ygg_schedule__task', {
  id: serial('id').primaryKey(),
  time: timestamp('time').notNull(),
  payload: text('payload').notNull(),
  consumed: boolean('consumed').notNull().default(false),
  consumer: text('consumer').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, table => ({
  timeIndex: index('time_index').on(table.time),
}))

export function insertScheduledTask<D extends Postgres>(db: D, time: Date, payload: string, consumer: string): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .insert(scheduledTask)
      .values({
          time,
          payload,
          consumer,
        },
      );
  });
}

export function findScheduledTaskById<D extends Postgres, Payload>(db: D, id: number): TaskOption<ScheduledEvent<Payload>> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(scheduledTask)
      .where(
        eq(scheduledTask.id, id),
      );
    if (result.length === 0) {
      return Promise.reject('Scheduled task not found');
    } else {
      const one = result[0];
      return {
        id: one.id,
        time: one.time,
        payload: JSON.parse(one.payload) as Payload,
        consumed: one.consumed,
        consumer: one.consumer,
        createdAt: one.createdAt,
      }
    }
  });
}

export function initialMagicEvent<D extends Postgres>(db: D): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .insert(scheduledTask)
      .values({
          time: new Date(MAGIC_EVENT_TIMESTAMP),
          payload: '1',
          consumer: '__preserved/last_consumed_at',
        },
      )
  });
}

export function getLastConsumedAt<D extends Postgres>(db: D): TaskOption<Date> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(scheduledTask)
      .where(
        eq(scheduledTask.time, new Date(MAGIC_EVENT_TIMESTAMP)),
      );
    if (result.length === 0) {
      return Promise.reject('Magic event not found');
    } else {
      const timestamp = parseInt(result[0].payload);
      return new Date(timestamp);
    }
  });
}

export function updateLastConsumedAt<D extends Postgres>(db: D, time: Date): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .update(scheduledTask)
      .set({
          payload: time.getTime().toString(),
        }
      )
      .where(
        eq(scheduledTask.time, new Date(MAGIC_EVENT_TIMESTAMP)),
      );
  });
}

export function getTimeoutEvents<D extends Postgres>(db: D, from: Date, to: Date): TaskOption<ScheduledEvent<unknown>[]> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(scheduledTask)
      .where(
        and(
          gte(scheduledTask.time, from),
          lte(scheduledTask.time, to),
          eq(scheduledTask.consumed, false),
        )
      );
    return result.map(one => ({
      id: one.id,
      time: one.time,
      payload: JSON.parse(one.payload),
      consumed: one.consumed,
      consumer: one.consumer,
      createdAt: one.createdAt,
    }));
  });
}

export function setEventConsumed<D extends Postgres>(db: D, id: number): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .update(scheduledTask)
      .set({
          consumed: true,
        }
      )
      .where(
        eq(scheduledTask.id, id),
      );
  });
}

export function deleteEventById<D extends Postgres>(db: D, id: number): TaskOption<void> {
  return tryCatch(async () => {
    await db
      .delete(scheduledTask)
      .where(
        eq(scheduledTask.id, id),
      );
  });
}