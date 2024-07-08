import * as M from '../models/userBalance';
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {UserBalanceDbFunctions} from '../../application/functions';

export function getUserBalanceDbFunctions(db: DatabaseAccessor): UserBalanceDbFunctions {
  return {
    findUserBalance: (userId) => M.findUserBalance(db(), userId),
    insertUserBalance: (userId) => M.insertUserBalance(db(), userId),
    updateUserBalance: (userId, availableBalance, reservedBalance) => M.updateUserBalance(db(), userId, availableBalance, reservedBalance),
    updateAvailableBalance: (userId, availableBalance) => M.updateAvailableBalance(db(), userId, availableBalance),
    updateReservedBalance: (userId, reservedBalance) => M.updateReservedBalance(db(), userId, reservedBalance),
    deleteUserBalance: (userId) => M.deleteUserBalance(db(), userId),
  };
}
