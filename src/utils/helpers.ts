import { errorLog } from './logger';

export function until<T>(promise: Promise<T>): Promise<any> {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => {
      return [err];
    });
}
