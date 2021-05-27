import { mapValues } from 'lodash';

export const sanitizeForCSV = value => {
  if (typeof value === 'object' && value !== null)
    return mapValues(value, sanitizeForCSV);

  if (typeof value !== 'string') {
    return value;
  }

  // sanitze general
  const sanitizedStringGeneral = value
    // limit to standard characters
    .replaceAll(
      /[^0-9A-Za-zçæœŒßäëïöüÿãñõâêîôûáéíóúýàèìòùÄËÏÖÜŸÃÑÕÂÊÎÔÛÁÉÍÓÚÝÀÈÌÒÙÇÆŒŒ.\-@+:]+/gi,
      ' '
    )
    // remove new lines
    .replaceAll(/[\n\r]/g, ' ')
    // replace leading + with 00 for phone numbers
    .replace(/^\+/, '00');

  // remove leading special characters to avoid formulars
  return sanitizedStringGeneral.replaceAll(/^[\t\r"'+=@`-\s]+/g, '_');
};

export const sanitizeObject = object => mapValues(object, sanitizeForCSV);
