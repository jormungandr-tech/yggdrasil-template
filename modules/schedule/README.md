# Yggdrasil Schedule Module

Schedule an event to be executed at a specific time.

```ts
type ModuleInterface = UtilsFunctions & DatabaseController & MainFunctions;
declare const schedule: YggdrasilModule<ModuleInterface>;

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
```