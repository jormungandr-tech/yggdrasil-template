import {autoRetry} from '@yggdrasil-template/base';
import {
  DatabaseController,
  MainFunctions,
} from '../application/functions';
import * as TO from 'fp-ts/TaskOption';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import {pipe} from 'fp-ts/function';
import {TaskOption} from 'fp-ts/TaskOption';
import {ScheduledEvent, ScheduledEventInDb} from '../application/dto';
import {trace} from '@yggdrasil-template/base';
import {ConsumerError, EventConsume, EventConsumer} from '../application/consumer';
import * as TE from 'fp-ts/TaskEither';

export function createMainFunctions(dbc: DatabaseController): MainFunctions {
  const getTimeoutEvents: () => TaskOption<ScheduledEventInDb[]> = () => pipe(
    // Get last consumed at
    // if not found, insert a magic event
    // if error, return none
    autoRetry<Date | null>(3)(dbc.getLastConsumedAt),
    TO.match<TO.TaskOption<Date>, Date | null>(
      () => {
        trace.error('[schedule module] Database error occurred when trying to get magic event');
        return TO.none;
      },
      (some) => {
        if (some !== null) {
          return TO.some(some);
        }
        trace.warn('[schedule module] Magic event not found, inserting one');
        return pipe(
          autoRetry<void>(3)(dbc.initialMagicEvent),
          TO.match<O.Option<Date>, void>(
            () => {
              trace.error('[schedule module] Database error occurred when trying to insert the magic event');
              return O.none;
            },
            () => O.some(new Date(1)),
          ),
        );
      },
    ),
    // convert Task<TaskOption<ScheduledEventInDb[]>> to TaskOption<ScheduledEventInDb[]>
    T.flatMap(a => a),
    // get events from last consumed at to now
    TO.match<O.Option<TO.TaskOption<ScheduledEventInDb[]>>, Date>(
      () => O.none,
      (lastConsumedAt) => {
        return O.some(autoRetry<ScheduledEventInDb[]>(3)(() => {
          return dbc.getEventsInTime(lastConsumedAt, new Date());
        }));
      },
    ),
    // convert TaskOption<TaskOption<ScheduledEventInDb[]>> to TaskOption<ScheduledEventInDb[]>
    TO.flatten,
  );
  const eventConsume:
    (consumers: EventConsumer<string, unknown>[])
      => (event: ScheduledEvent<string, unknown>)
      => TE.TaskEither<void, ConsumerError> =
    (consumers) => {
        return EventConsume(consumers);
    };
  return {
    addScheduledTask: dbc.insertScheduledTask,
    getTimeoutEvents,
    eventConsume,
  };
}