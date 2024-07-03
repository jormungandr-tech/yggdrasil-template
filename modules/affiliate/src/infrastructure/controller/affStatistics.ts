import * as M from '../models/affStatistics';
import {DatabaseAccessor} from '@yggdrasil-template/base';
import {AffStatisticsDbFunctions} from '../../application/functions';

export function getStatisticsDbFunctions(db: DatabaseAccessor): AffStatisticsDbFunctions {
  return {
    insertAffiliateStatistics: (userId, rate) => M.insertAffiliateStatistics(db(), userId, rate),
    findAffiliateStatistics: (userId) => M.findAffiliateStatistics(db(), userId),
    deleteAffiliateStatistics: (userId) => M.deleteAffiliateStatistics(db(), userId),
    updateAffiliateStatistics: (userId, totalRewards, withdrawnRewards, countReferrals) => M.updateAffiliateStatistics(db(), userId, totalRewards, withdrawnRewards, countReferrals),
  };
}