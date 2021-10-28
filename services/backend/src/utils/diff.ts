import { pickBy, keys } from 'lodash';

export function checkPropertyChanges(
  newO: Record<string, string | number | null | undefined>,
  oldO: Record<string, string | number | null | undefined>
): Record<string, boolean> {
  const cleanedNew = pickBy(newO, v => typeof v !== 'undefined');

  const diff: Record<string, boolean> = {};

  keys(cleanedNew).forEach((key: string) => {
    diff[String(key)] = cleanedNew[String(key)] !== oldO[String(key)];
  });

  return diff;
}
