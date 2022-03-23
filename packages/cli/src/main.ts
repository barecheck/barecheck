import { awesomeFn } from '@barecheck/core';

export function cli() {
  awesomeFn();
  return Promise.resolve(true);
}
