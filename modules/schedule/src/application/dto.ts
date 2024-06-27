export interface ScheduledEvent<Payload> {
  id: number;
  time: Date;
  payload: Payload;
  consumed: boolean;
  consumer: string;
  createdAt: Date;
}

export interface ScheduledEventInDb extends ScheduledEvent<unknown> {}

export const MAGIC_EVENT_TIMESTAMP = 114514;

export interface MagicEvent extends ScheduledEventInDb {
  consumer: "__preserved/last_consumed_at"
  payload: number;
}