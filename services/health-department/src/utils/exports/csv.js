import Papa from 'papaparse';
import { sanitizeForCSV } from '../sanitizer';

const assert = assertion => {
  if (!assertion) {
    throw new Error('CSV assertion failed');
  }
};
const assertCSVtoData = (csv, data) => {
  const { data: parsedCSVData } = Papa.parse(csv);
  assert(parsedCSVData.every(row => row.length === data[0].length));
  assert(parsedCSVData.length === data.length);
};

/*
 * Creates CSV file, takes input as matrix, so rows containing cells
 * asserts each row has the same length
 * sanitizes each cell
 * uses papaparse with enable esacaping
x */
export const createCSV = (rows, sormasDelimiter = false) => {
  assert(rows && rows.length > 1);

  const headerLength = rows[0].length;
  const everyRowHasHeaderLength = rows.every(
    row => row.length === headerLength
  );
  assert(everyRowHasHeaderLength);

  const sanitizedRows = rows.map(row => row.map(cell => sanitizeForCSV(cell)));

  let csv;
  try {
    csv = Papa.unparse(sanitizedRows, {
      ...(sormasDelimiter && { delimiter: ';' }),
      quotes: true,
      escapeFormulae: true,
    });
  } catch (error) {
    console.info('CSV error', error);
    return false;
  }
  assertCSVtoData(csv, rows);

  return csv;
};
