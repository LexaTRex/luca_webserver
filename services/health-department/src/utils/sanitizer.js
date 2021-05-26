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
    .replaceAll(
      /[^0-9A-Za-zçæœŒßäëïöüÿãñõâêîôûáéíóúýàèìòùÄËÏÖÜŸÃÑÕÂÊÎÔÛÁÉÍÓÚÝÀÈÌÒÙÇÆŒŒ]+/gi,
      ' '
    )
    .replaceAll(
      /DROP|DELETE|SELECT|INSERT|UPDATE|TRUNCATE|FROM|JOIN|CREATE/gi,
      ' '
    )
    .replaceAll(/[\n\r]/g, ' ')
    .replaceAll('"', '""')
    .replace(/^\+/, "'+");

  const forbiddenLeadingSigns = ['=', '-', '@', '\t'];

  return forbiddenLeadingSigns.includes(sanitizedString?.charAt(0))
    ? sanitizeForCSV(sanitizedString.slice(1))
    : sanitizedString;
};

export const sanitizeObject = object => mapValues(object, sanitizeForCSV);
