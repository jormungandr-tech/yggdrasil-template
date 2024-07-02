export interface SuccessResult<Ok = undefined> {
  success: true;
  data: Ok;
}

export interface ErrorResult<Err = undefined> {
  success: false;
  error: Err;
}

export type Result<Ok = undefined, Err = undefined> = SuccessResult<Ok> | ErrorResult<Err>;

export function successResult<Ok = undefined>(data: Ok): SuccessResult<Ok> {
  return { success: true, data };
}

export function errorResult<Err = undefined>(error: Err): ErrorResult<Err> {
  return { success: false, error };
}