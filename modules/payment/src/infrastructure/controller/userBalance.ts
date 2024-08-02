import {userBalance} from '../schema/userBalance';
import {DatabaseAccessor, Postgres} from '@yggdrasil-template/base';
import {UserBalanceDbFunctions} from '../../application/functions';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {UserBalanceRecord} from '../../application/dto';
import {eq} from 'drizzle-orm';

function findUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<UserBalanceRecord> {
  return tryCatch(async () => {
    const result = await db
      .select()
      .from(userBalance)
      .where(eq(userBalance.userId, userId));
    if (result.length === 0) {
      return Promise.reject('User balance not found');
    } else {
      return result[0];
    }
  });
}

function insertUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .insert(userBalance)
      .values({
        userId,
      });
  });
}

function updateUserBalance<T extends Postgres>(
  db: T,
  userId: string,
  availableBalance: string,
  reservedBalance: string,
): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        availableBalance,
        reservedBalance,
      })
      .where(eq(userBalance.userId, userId));
  });
}

function updateAvailableBalance<T extends Postgres>(db: T, userId: string, availableBalance: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        availableBalance,
      })
      .where(eq(userBalance.userId, userId));
  });
}

function updateReservedBalance<T extends Postgres>(db: T, userId: string, reservedBalance: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .update(userBalance)
      .set({
        reservedBalance,
      })
      .where(eq(userBalance.userId, userId));
  });
}

function deleteUserBalance<T extends Postgres>(db: T, userId: string): TaskOption<void> {
  return tryCatch(() => {
    return db
      .delete(userBalance)
      .where(eq(userBalance.userId, userId));
  });
}

export function getUserBalanceDbFunctions(db: DatabaseAccessor): UserBalanceDbFunctions {
  return {
    findUserBalance: (userId) => findUserBalance(db(), userId),
    insertUserBalance: (userId) => insertUserBalance(db(), userId),
    updateUserBalance: (userId, availableBalance, reservedBalance) => updateUserBalance(db(), userId, availableBalance, reservedBalance),
    updateAvailableBalance: (userId, availableBalance) => updateAvailableBalance(db(), userId, availableBalance),
    updateReservedBalance: (userId, reservedBalance) => updateReservedBalance(db(), userId, reservedBalance),
    deleteUserBalance: (userId) => deleteUserBalance(db(), userId),
  };
}
