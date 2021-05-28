import { mapValues } from 'lodash';

export const sanitizeForCSV = value => {
  if (typeof value === 'object' && value !== null)
    return mapValues(value, sanitizeForCSV);

  if (typeof value === 'number') {
    return `${value}`;
  }

  if (typeof value !== 'string') {
    return '';
  }

  // sanitze general
  const sanitizedStringGeneral = value
    // limit to allowed characters
    .replace(
      /[^\w +.:@£À-ÿāăąćĉċčđēėęěĝğģĥħĩīįİıĵķĸĺļłńņōőœŗřśŝšţŦũūŭůűųŵŷźżžơưếệ-]+/gi,
      ' '
    )
    // remove new lines
    .replace(/[\n\r]/g, ' ')
    // replace leading + with 00 for phone numbers
    .replace(/^\+/, '00');

  // remove leading special characters to avoid formulars
  return sanitizedStringGeneral.replace(/^[\s"'+=@`-]+/g, '_');
};

export const sanitizeObject = object => mapValues(object, sanitizeForCSV);
