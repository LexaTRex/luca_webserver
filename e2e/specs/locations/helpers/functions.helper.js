import { E2E_DEFAULT_LOCATION_SCANNER } from './locations';

export const createGroupPayload = {
  type: 'base',
  name: 'Testing group',
  firstName: 'Torsten',
  lastName: 'Tester',
  phone: '017612345678',
  streetName: 'Charlottenstr.',
  streetNr: '59',
  zipCode: '10117',
  city: 'Berlin',
  state: 'Berlin',
  lat: 0,
  lng: 0,
  radius: 0,
  tableCount: null,
  isIndoor: true,
};

export const getCreateLocationPayload = (groupId, locationName) => ({
  groupId,
  locationName,
  firstName: 'Torsten',
  lastName: 'Tester',
  streetName: 'Charlottenstr.',
  phone: '017612345678',
  streetNr: '59',
  zipCode: '10117',
  city: 'Berlin',
  state: 'Berlin',
  lat: 0,
  lng: 0,
  tableCount: 10,
  type: 'base',
});

// Fake trace data
export const traceDataPayload = {
  data:
    'xjpySSaTjWlaudphEb/gUG7ZpYtbkuD93PgKgSZhj+MLzRyreu4CwN+Z9rogtwzQXp2E6GfdHSRYXBPvUdMnlqOQAIjU7dYrmIY4',
  deviceType: 4,
  iv: 'ZpW6zMLHKjix9c10a+4d6w==',
  mac: 'LSMAjTjtBDAAFzhMeiV4/vjjHZO64EJa45jFgzG7iYg=',
  publicKey:
    'BCbsDAh8GiavgoDN0JEP9B+WSNvDI6PHZKvHbQpyW+T3dmBJTanLWxbyxbj6QEroG3wjQRbhDlaxeeuU5ycmd6Y=',
  scannerId: E2E_DEFAULT_LOCATION_SCANNER,
  timestamp: parseInt(Date.now() / 1000),
  traceId: 'w2RiSHiitpfJ0hxcJz5ZYw==',
};
