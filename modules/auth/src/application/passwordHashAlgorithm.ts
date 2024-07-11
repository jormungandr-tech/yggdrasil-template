import {TaskOption} from 'fp-ts/TaskOption';

export interface PasswordHashAlgorithm {
  generateHash(password: string): TaskOption<string>;
  verifyHash(password: string, hash: string): TaskOption<boolean>
}