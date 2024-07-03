import {DatabaseAccessor, autoRetry} from '@yggdrasil-template/base';
import {AffDbFunctions, eventPostFunction, MainFunctions, PostAffiliateEventResult} from '../application/functions';
import {getStatisticsDbFunctions} from '../infrastructure/controller/affStatistics';
import {getGraphDbFunctions} from '../infrastructure/controller/affGraph';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import * as TA from 'fp-ts/Task';
import {AffiliateEventListener, AffiliateGraph, AffiliateStatistics} from '../application/dto';
import {pipe} from 'fp-ts/function';

export function getDbFunctions(db: DatabaseAccessor): AffDbFunctions {
  return {
    ...getStatisticsDbFunctions(db),
    ...getGraphDbFunctions(db),
  };
}

function implGetStatistics(db: AffDbFunctions, userId: string): TO.TaskOption<AffiliateStatistics> {
  return db.findAffiliateStatistics(userId);
}

function implWithdrawRewards(db: AffDbFunctions, userId: string, amount: number): TO.TaskOption<void> {
  return pipe(
    // find user statistics
    autoRetry<AffiliateStatistics>(3)(() => db.findAffiliateStatistics(userId)),
    // if it does not exist, return none
    // if it does not have enough rewards, return none
    // if enough, return new statistics
    TO.match<O.Option<AffiliateStatistics>, AffiliateStatistics>(
      () => O.none,
      (some) => {
        const canWithdraw = some.totalRewards - some.withdrawnRewards >= amount;
        if (!canWithdraw) {
          return O.none;
        } else {
          const newStats = {
            ...some,
            withdrawnRewards: some.withdrawnRewards + amount,
          };
          return O.some(newStats);
        }
      },
    ),
    // update statistics
    TO.flatMap<AffiliateStatistics, void>(
      (newStats) => autoRetry<void>(3)(
        () => db.updateAffiliateStatistics(
          userId,
          newStats.totalRewards,
          newStats.withdrawnRewards,
          newStats.countReferrals,
        ),
      ),
    ),
  );
}

function implGetAllInvitedUsers(db: AffDbFunctions, limit: number, offset: number): (userId: string) => TO.TaskOption<AffiliateGraph[]> {
  return (userId) => db.findAffiliateRelationByFrom(userId, limit, offset);
}

function implGetInviter(db: AffDbFunctions, userId: string): TO.TaskOption<AffiliateGraph> {
  return pipe(
    db.findAffiliateRelationByTo(userId),
    TO.match<O.Option<AffiliateGraph>, AffiliateGraph[]>(
      () => O.none,
      (some) => {
        if (some.length === 0) {
          return O.none;
        } else {
          return O.some(some[0]);
        }
      },
    ),
  );
}

function implGetPostAffiliateEventFunction<T = void>(db: AffDbFunctions, listener: AffiliateEventListener<T>): eventPostFunction<T> {
  return (event) => pipe(
    autoRetry<void>(3)(() => db.insertAffiliateRelation(event.from, event.to, event.reward, event.rate)),
    TO.match<boolean, void>(
      () => false,
      () => true,
    ),
    TA.map<boolean, TA.Task<[boolean, O.Option<T>]>>((recorded) => {
      if (!recorded) {
        return TA.of([false, O.none]);
      }
      return pipe(
        listener(event),
        TO.match<[boolean, O.Option<T>], T>(
          () => [true, O.none],
          (some) => [true, O.some(some)],
        ),
      );
    }),
    TA.flatten,
    TA.map<[boolean, O.Option<T>], PostAffiliateEventResult<T>>(
      ([recorded, result]) => ({
        recorded,
        listenerSuccess: O.isSome(result),
        listenerResult: result,
      }),
    ),
  );
}

export function getMainFunctions(db: AffDbFunctions): MainFunctions {
  return {
    getStatistics: (userId) => implGetStatistics(db, userId),
    withdrawRewards: (userId, amount) => implWithdrawRewards(db, userId, amount),
    getAllInvitedUsers: (limit, offset) => implGetAllInvitedUsers(db, limit, offset),
    getInviter: (userId) => implGetInviter(db, userId),
    getPostAffiliateEventFunction: <T = void>(listener: AffiliateEventListener<T>) => implGetPostAffiliateEventFunction<T>(db, listener),
  }
}