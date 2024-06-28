import {ScheduledEvent, ScheduledEventInDb} from './dto';
import {none, Option, some} from 'fp-ts/Option';

export function downcastDbEvent<Consumer extends string, Payload>(
  event: ScheduledEventInDb,
  expectedConsumer: Consumer,
): Option<ScheduledEvent<Consumer, Payload>> {
  if (event.consumer !== expectedConsumer) {
    return none;
  } else {
    return some(
      {
        ...event,
        consumer: expectedConsumer,
        payload: event.payload as Payload,
      },
    )
  }
}