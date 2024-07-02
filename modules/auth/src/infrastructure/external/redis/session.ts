import * as IO from 'fp-ts/IO';
import Redis from 'ioredis';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';
import {sessionKey} from '../../../application/dto';
import * as O from 'fp-ts/Option';

const TOKEN_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const TOKEN_LENGTH = 64;

export function randomToken(): IO.IO<string> {
  return () => {
    let token = '';
    for (let i = 0; i < TOKEN_LENGTH; i++) {
      token += TOKEN_ALPHABET.charAt(Math.floor(Math.random() * TOKEN_ALPHABET.length));
    }
    return token;
  };
}

export function addSessionToken(redis: Redis):
  (expiresAfterSeconds: number)
    => (token: string)
    => (userId: string)
    => TaskOption<void> {
  return (expiresAfterSeconds) =>
    (token) =>
      (userId) =>
        implAddSessionToken(redis, expiresAfterSeconds, token, userId);
}

function implAddSessionToken(
  redis: Redis,
  expiresAfterSeconds: number,
  token: string,
  userId: string,
): TaskOption<void> {
  return tryCatch(async () => {
    await redis.set(sessionKey(token), userId, 'EX', expiresAfterSeconds);
  });
}

export function findUserIdByToken(redis: Redis):
  (token: string)
    => TaskOption<O.Option<string>> {
  return (token) => implFindUserIdByToken(redis, token);
}

function implFindUserIdByToken(
  redis: Redis,
  token: string,
): TaskOption<O.Option<string>> {
  return tryCatch(async () => {
    const result = await redis.get(sessionKey(token));
    if (result === null) {
      return O.none
    } else {
      return O.some(result);
    }
  });
}

export function removeSessionToken(redis: Redis):
  (token: string)
    => TaskOption<void> {
  return (token) => implRemoveSessionToken(redis, token);
}

function implRemoveSessionToken(
  redis: Redis,
  token: string,
): TaskOption<void> {
  return tryCatch(async () => {
    await redis.del(sessionKey(token));
  });
}