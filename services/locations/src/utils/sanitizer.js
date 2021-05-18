import { mapValues } from 'lodash';

export const sanitizeForCSV = value => {
  if (
    typeof value === 'number' ||
    typeof value === 'undefined' ||
    typeof value === 'boolean' ||
    value === null
  )
    return value;
  if (typeof value === 'object') return mapValues(value, sanitizeForCSV);
  const sanitizedString = value
    .replaceAll(/[\n\r]/g, ' ')
    .replaceAll('"', '""') // not done by library
    .replace(/^\+/, "'+");

  const forbiddenLeadingSigns = ['=', '-', '@', '\t'];

  return forbiddenLeadingSigns.includes(sanitizedString?.charAt(0))
    ? sanitizeForCSV(sanitizedString.slice(1))
    : sanitizedString;
};

export const sanitizeObject = object => mapValues(object, sanitizeForCSV);
