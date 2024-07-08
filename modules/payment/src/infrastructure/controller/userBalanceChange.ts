import * as M from '../models/userBalanceChange';
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {UserBalanceChangeLogDbFunctions} from '../../application/functions';

export function getUserBalanceChangeLogDbFunctions(db: DatabaseAccessor): UserBalanceChangeLogDbFunctions {
  return {
    insertUserBalanceChangeLog: (userId, changeAmount, changeType, changeReason) => M.insertUserBalanceChange(
      db(), userId, changeAmount, changeType, changeReason
    ),
    findUserBalanceChangeLogById: (id) => M.findUserBalanceChangeById(db(), id),
    findUserBalanceChangeLogByUserId: (userId, limit, offset) => M.findUserBalanceChangeByUserId(db(), userId, limit, offset),
    deleteOneUserBalanceChangeLog: (id) => M.deleteOneUserBalanceChange(db(), id),
    deleteAllUserBalanceChangeLog: (userId) => M.deleteAllUserBalanceChange(db(), userId),
  };
}