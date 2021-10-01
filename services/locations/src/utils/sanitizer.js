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

  // sanitze general
  const sanitizedStringGeneral = value
    // limit to standard characters
    .replace(
      /[^0-9A-Za-zçæœŒßäëïöüÿãñõâêîôûáéíóúýàèìòùÄËÏÖÜŸÃÑÕÂÊÎÔÛÁÉÍÓÚÝÀÈÌÒÙÇÆŒŒ.\-@+:]+/gi,
      ' '
    )
    // remove new lines
    .replace(/[\n\r]/g, ' ')
    // replace leading + with 00 for phone numbers
    .replace(/^\+/, '00');

  // remove leading special characters to avoid formulars
  return sanitizedStringGeneral.replace(/^[\t\r"'+=@`-\s]+/g, '_');
};

export const sanitizeObject = object => mapValues(object, sanitizeForCSV);
