import {userBalanceChange} from '../schema/userBalanceChange';
import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {UserBalanceChangeLogDbFunctions} from '../../application/functions';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {UserBalanceChangeLog, UserBalanceChangeType} from '../../application/dto';
import {eq} from 'drizzle-orm';

function insertUserBalanceChange<T extends Postgres>(
  db: T,
  userId: string,
  amount: string,
  type: UserBalanceChangeType,
  reason: string = '',
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(userBalanceChange)
      .values({
        userId,
        amount,
        type,
        reason,
      });
  });
}

function findUserBalanceChangeByUserId<T extends Postgres>(
  db: T,
  userId: string,
  limit: number,
  offset: number,
): TaskOption<UserBalanceChangeLog[]> {
  return tryCatch(() => {
    return db
      .select()
      .from(userBalanceChange)
      .where(eq(userBalanceChange.userId, userId))
      .limit(limit)
      .offset(offset);
  });
}

function findUserBalanceChangeById<T extends Postgres>(db: T, id: number): TaskOption<UserBalanceChangeLog> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(userBalanceChange)
      .where(eq(userBalanceChange.id, id));
    return result[0];
  });
}

function deleteOneUserBalanceChange<T extends Postgres>(db: T, id: number): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(userBalanceChange)
      .where(eq(userBalanceChange.id, id));
  });
}

function deleteAllUserBalanceChange<T extends Postgres>(db: T, userId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(userBalanceChange)
      .where(eq(userBalanceChange.userId, userId));
  });
}

export function getUserBalanceChangeLogDbFunctions(db: DatabaseAccessor): UserBalanceChangeLogDbFunctions {
  return {
    insertUserBalanceChangeLog: (userId, changeAmount, changeType, changeReason) => insertUserBalanceChange(
      db(), userId, changeAmount, changeType, changeReason
    ),
    findUserBalanceChangeLogById: (id) => findUserBalanceChangeById(db(), id),
    findUserBalanceChangeLogByUserId: (userId, limit, offset) => findUserBalanceChangeByUserId(db(), userId, limit, offset),
    deleteOneUserBalanceChangeLog: (id) => deleteOneUserBalanceChange(db(), id),
    deleteAllUserBalanceChangeLog: (userId) => deleteAllUserBalanceChange(db(), userId),
  };
}