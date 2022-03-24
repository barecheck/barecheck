import { parseLcovFile } from '@barecheck/core';

export async function cli() {
  const { percentage } = await parseLcovFile('./');

  return percentage;
}
