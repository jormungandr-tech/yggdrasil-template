import {TaskOption} from 'fp-ts/TaskOption';

export interface AffiliateStatistics {
  userId: string;
  totalRewards: number;
  withdrawnRewards: number;
  countReferrals: number;
  rate: number;
}

export interface AffiliateGraph {
  id: number;
  from: string;
  to: string;
  reward: number;
  rate: number;
  createdAt: Date;
}

export interface AffiliateEvent {
  from: string;
  to: string;
  reward: number;
  rate: number;
}

export interface AffiliateEventListener<T = void> {
  (event: AffiliateEvent): TaskOption<T>;
}