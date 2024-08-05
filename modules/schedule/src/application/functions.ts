import {TaskOption} from 'fp-ts/TaskOption';
import {ConsumerError, EventConsumer} from './consumer';
import {ScheduledEvent, ScheduledEventInDb} from './dto';
import * as TE from 'fp-ts/TaskEither';
import {Option} from 'fp-ts/Option';
import {DatabaseAccessor} from "@yggdrasil-template/base"
import {
  deleteEventById,
  findScheduledTaskById,
  getLastConsumedAt, getEventsInTime,
  initialMagicEvent,
  insertScheduledTask, setEventConsumed, setEventsConsumed, updateLastConsumedAt,
} from '../infrastructure/controller/scheduledTask';
import {downcastDbEvent} from './downcast';

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
  getLastConsumedAt: () => TaskOption<Date | null>;
  updateLastConsumedAt: (time: Date) => TaskOption<void>;
  getEventsInTime: (from: Date, to: Date) => TaskOption<ScheduledEventInDb[]>;
  setEventConsumed: (id: number, consumed: boolean) => TaskOption<void>;
  setEventsConsumed: (ids: number[], consumed: boolean) => TaskOption<void>;
  deleteEventById: (id: number) => TaskOption<void>;
}

export function createDatabaseController(db: DatabaseAccessor): DatabaseController {
  return {
    insertScheduledTask: (event: ScheduledTaskToAdd) => insertScheduledTask(db(), event.time, JSON.stringify(event.payload), event.consumer),
    findScheduledTaskById: (id: number) => findScheduledTaskById(db(), id),
    initialMagicEvent: () => initialMagicEvent(db()),
    getLastConsumedAt: () => getLastConsumedAt(db()),
    updateLastConsumedAt: (time: Date) => updateLastConsumedAt(db(), time),
    getEventsInTime: (from: Date, to: Date) => getEventsInTime(db(), from, to),
    setEventConsumed: (id, consumed) => setEventConsumed(db(), id, consumed),
    setEventsConsumed: (ids, consumed) => setEventsConsumed(db(), ids, consumed),
    deleteEventById: (id) => deleteEventById(db(), id),
  }
}

export function getUtilsFunctions(): UtilsFunctions {
  return {
    downcastDbEvent
  }
}