import {TaskOption} from 'fp-ts/TaskOption';
import {ConsumerError, EventConsumer} from './consumer';
import {ScheduledEvent, ScheduledEventInDb} from './dto';
import * as TE from 'fp-ts/TaskEither';
import {Option} from 'fp-ts/Option';
import {DatabaseAccessor} from "@yggdrasil-template/base"
import {
  deleteEventById,
  findScheduledTaskById,
  getLastConsumedAt, getTimeoutEvents,
  initialMagicEvent,
  insertScheduledTask, setEventConsumed, updateLastConsumedAt,
} from '../infrastructure/models/scheduledTask';

export interface ScheduledTaskToAdd {
  time: Date;
  consumer: string;
  payload: unknown;
}

export interface MainFunctions {
  addScheduledTask: (event: ScheduledTaskToAdd) => TaskOption<void>;
  eventConsume: (consumers: EventConsumer<string, unknown>[]) => (event: ScheduledEvent<string, unknown>) => TE.TaskEither<void, ConsumerError>;
  getTimeoutEvents: () =>  TaskOption<ScheduledEventInDb[]>;
}

export interface UtilsFunctions {
  downcastDbEvent: <Consumer extends string, Payload>(event: ScheduledEventInDb, expectedConsumer: Consumer)=> Option<ScheduledEvent<Consumer, Payload>>;
}

export interface DatabaseController {
  insertScheduledTask: (event: ScheduledTaskToAdd) => TaskOption<void>;
  findScheduledTaskById: (id: number) => TaskOption<ScheduledEventInDb>;
  initialMagicEvent: () => TaskOption<void>;
  getLastConsumedAt: () => TaskOption<Date>;
  updateLastConsumedAt: (time: Date) => TaskOption<void>;
  getTimeoutEvents: (from: Date, to: Date) => TaskOption<ScheduledEventInDb[]>;
  setEventConsumed: (id: number) => TaskOption<void>;
  deleteEventById: (id: number) => TaskOption<void>;
}

export function createDatabaseController(db: DatabaseAccessor): DatabaseController {
  return {
    insertScheduledTask: (event: ScheduledTaskToAdd) => insertScheduledTask(db(), event.time, JSON.stringify(event.payload), event.consumer),
    findScheduledTaskById: (id: number) => findScheduledTaskById(db(), id),
    initialMagicEvent: () => initialMagicEvent(db()),
    getLastConsumedAt: () => getLastConsumedAt(db()),
    updateLastConsumedAt: (time: Date) => updateLastConsumedAt(db(), time),
    getTimeoutEvents: (from: Date, to: Date) => getTimeoutEvents(db(), from, to),
    setEventConsumed: (id: number) => setEventConsumed(db(), id),
    deleteEventById: (id: number) => deleteEventById(db(), id),
  }
}