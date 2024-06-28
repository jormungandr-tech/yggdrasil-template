export interface ScheduledEvent<Consumer extends string, Payload> {
  id: number;
  time: Date;
  payload: Payload;
  consumed: boolean;
  consumer: Consumer;
  createdAt: Date;
}

export interface ScheduledEventInDb extends ScheduledEvent<string, unknown> {}

export const MAGIC_EVENT_TIMESTAMP = 114514;

export declare const MAGIC_EVENT: ScheduledEvent<'__preserved/last_consumed_at', number>;