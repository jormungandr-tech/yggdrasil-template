import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import {ScheduledEvent} from './dto';
import {pipe} from 'fp-ts/function';
import {tracer} from '@yggdrasil-template/base';

export interface RetryFunction<EventPayload> {
  (payload: EventPayload): (reason: string) => TE.TaskEither<void, string>;
}

export interface EventListener<Name extends string, Payload> {
  (event: ScheduledEvent<Name, Payload>): TE.TaskEither<void, string>;
}

export interface EventConsumer<Name extends string, Payload> {
  listener: EventListener<Name, Payload>;
  retry: RetryFunction<Payload>;
  name: Name;
}

export enum ConsumerError {
  NoConsumerMatched,
  RetryLimitExceeded,
}

export function EventConsume(
  consumers: EventConsumer<string, unknown>[]
): (event: ScheduledEvent<string, unknown>) => TE.TaskEither<void, ConsumerError> {
  return event => {
    const consumer = consumers.find(consumer => consumer.name === event.consumer);
    if (consumer === undefined) {
      tracer.warn('schedule module', `${event.consumer} consumer not found. ${event.id} event is ignored.`)
      return TE.right(ConsumerError.NoConsumerMatched);
    }
    return pipe(
      consumer.listener(event),
      TE.match<void, TE.TaskEither<void, string>, string>(
        () => TE.left(undefined),
        consumer.retry(event.payload),
      ),
      T.flatMap(
        TE.match<void, TE.TaskEither<void, ConsumerError>, string>(
          () => TE.left(undefined),
          () => {
            tracer.error('schedule module', `Retry limit exceeded for #${event.id} event`);
            return TE.right(ConsumerError.RetryLimitExceeded);
          },
        ),
      ),
      T.flatMap(a => a),
    );
  };
}