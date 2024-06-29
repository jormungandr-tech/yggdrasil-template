import * as TO from 'fp-ts/TaskOption';
import {pipe} from 'fp-ts/function';
import * as TA from 'fp-ts/Task';
import * as O from 'fp-ts/Option';

export function autoRetry<T>(maxRetries: number): (func: () => TO.TaskOption<T>) => TO.TaskOption<T> {
  return (func: () => TO.TaskOption<T>): TO.TaskOption<T> => {
    if (maxRetries < 1) {
      return TO.none as TO.TaskOption<T>;
    }
    if (maxRetries === 1) {
      return func() as TO.TaskOption<T>;
    }
    return pipe(
      func(),
      TO.match<TO.TaskOption<T>, T>(
        () => autoRetry<T>(maxRetries - 1)(func),
        (a: T) => TO.some(a),
      ),
      TA.flatMap(a => a),
    )
  };
}

/**
 * @description Convert a function who returns Task to a function who returns Task with a delay
 * @param ms - delay in milliseconds
 * @example const delayedTask = delayTaskOption(1000)(func);
 */
export function delayTask<T>(ms: number): (func: () => TA.Task<T>) => () => TA.Task<T> {
  return (func: () => TA.Task<T>): () => TA.Task<T> => {
    const newTask = async () => {
      await new Promise(resolve => setTimeout(resolve, ms));
      return func();
    }
    return () => TA.flatten(newTask);
  }
}

/**
 * @description Convert a function who returns TaskOption to a function who returns TaskOption with a delay
 * @param ms - delay in milliseconds
 * @example const delayedTaskOption = delayTaskOption(1000)(func);
 */
export function delayTaskOption<T>(ms: number): (func: () => TO.TaskOption<T>) => () => TO.TaskOption<T> {
  return (func: () => TO.TaskOption<T>): () => TO.TaskOption<T> => {
    return delayTask<O.Option<T>>(ms)(func);
  }
}