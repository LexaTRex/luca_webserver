import { formatTraceForSormas } from './SormasDownload.helper';

describe('formatTraceForSormas', () => {
  it('sanitizes user input', () => {
    const userData = { fn: '=first\r\nname' };
    const additionalData = { table: '!40' };
    const trace = {
      userData,
      checkin: 1000000,
      additionalData,
    };
    const mockIntl = { formatMessage: jest.fn(({ id }) => id) };
    const location = { name: '--location name--' };
    const output = formatTraceForSormas(trace, location, mockIntl);
    expect(output['person.firstName']).toBe('_first name');
    expect(output.description).not.toContain('!');
    expect(output.description).toContain(
      'contactPersonTable.additionalData.table: _40'
    );
    expect(output.description).toMatch(/^_location name--/);
  });
});
