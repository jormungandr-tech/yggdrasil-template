import {PasswordHashAlgorithm} from '../../application/passwordHashAlgorithm';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import {TaskOption, tryCatch} from 'fp-ts/TaskOption';

function generateHashArgon2(password: string): TaskOption<string> {
  return tryCatch(() => argon2.hash(password));
}

function verifyHashArgon2(password: string, hash: string): TaskOption<boolean> {
  return tryCatch(() => argon2.verify(hash, password));
}

export const argon2Algorithm: PasswordHashAlgorithm = {
  generateHash: generateHashArgon2,
  verifyHash: verifyHashArgon2,
};

function generateHashBcrypt(password: string): TaskOption<string> {
  return tryCatch(() => bcrypt.hash(password, 10));
}

function verifyHashBcrypt(password: string, hash: string): TaskOption<boolean> {
  return tryCatch(() => bcrypt.compare(password, hash));
}

export const bcryptAlgorithm: PasswordHashAlgorithm = {
  generateHash: generateHashBcrypt,
  verifyHash: verifyHashBcrypt,
};
