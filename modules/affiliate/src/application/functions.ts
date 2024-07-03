import {AffiliateEvent, AffiliateEventListener, AffiliateGraph, AffiliateStatistics} from './dto';
import {TaskOption} from 'fp-ts/TaskOption';
import {Task} from 'fp-ts/Task';
import {Option} from 'fp-ts/Option';

export interface PostAffiliateEventResult<T = void> {
  recorded: boolean;
  listenerSuccess: boolean;
  listenerResult: Option<T>;
}

export interface eventPostFunction<T = void> {
  (event: AffiliateEvent): Task<PostAffiliateEventResult<T>>;
}

export interface MainFunctions {
  getPostAffiliateEventFunction<T = void>(listener: AffiliateEventListener<T>):  eventPostFunction<T>;
  getStatistics(userId: string): TaskOption<AffiliateStatistics>;
  withdrawRewards(userId: string, amount: number): TaskOption<void>;
  getAllInvitedUsers(limit: number, offset: number): (userId: string) => TaskOption<AffiliateGraph[]>;
  getInviter(userId: string): TaskOption<AffiliateGraph>;
}

export interface AffGraphDbFunctions {
  insertAffiliateRelation(from: string, to: string, reward: number, rate: number): TaskOption<void>;
  findAffiliateRelationById(id: number): TaskOption<AffiliateGraph>;
  findAffiliateRelationByFrom(from: string, limit: number, offset: number): TaskOption<AffiliateGraph[]>;
  findAffiliateRelationByTo(to: string): TaskOption<AffiliateGraph[]>;
}

export interface AffStatisticsDbFunctions {
  insertAffiliateStatistics(userId: string, rate: number): TaskOption<void>;
  findAffiliateStatistics(userId: string): TaskOption<AffiliateStatistics>;
  deleteAffiliateStatistics(userId: string): TaskOption<void>;
  updateAffiliateStatistics(userId: string, totalRewards: number, withdrawnRewards: number, countReferrals: number): TaskOption<void>;
}

export interface AffDbFunctions extends AffGraphDbFunctions, AffStatisticsDbFunctions {}