import {
  E2E_DEFAULT_LOCATION_SCANNER,
  E2E_DEFAULT_LOCATION_UUID,
} from '../constants/locations';
import {
  DEVICE_TYPE_ANDROID,
  DEVICE_TYPE_FORM,
  DEVICE_TYPE_IOS,
  DEVICE_TYPE_WEBAPP,
} from '../constants/deviceTypes';

export const E2E_DYNAMIC_TRACE_ID = 'w2RiSHiitpfJ0hxcJz5ZYw==';
export const E2E_FORM_TRACE_ID = 'MPc2dmPJQkfS5uqIc4yG1A==';

export const DYNAMIC_DEVICE_TYPES = {
  DEVICE_TYPE_IOS,
  DEVICE_TYPE_ANDROID,
  DEVICE_TYPE_WEBAPP,
};

export const createGroupPayload = {
  type: 'base',
  name: 'Testing group',
  firstName: 'Torsten',
  lastName: 'Tester',
  phone: '+4917612345678',
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
  phone: '+4917612345678',
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
export const dynamicTraceDataPayload = {
  data:
    'xjpySSaTjWlaudphEb/gUG7ZpYtbkuD93PgKgSZhj+MLzRyreu4CwN+Z9rogtwzQXp2E6GfdHSRYXBPvUdMnlqOQAIjU7dYrmIY4',
  deviceType: DEVICE_TYPE_WEBAPP,
  iv: 'ZpW6zMLHKjix9c10a+4d6w==',
  mac: 'LSMAjTjtBDAAFzhMeiV4/vjjHZO64EJa45jFgzG7iYg=',
  publicKey:
    'BCbsDAh8GiavgoDN0JEP9B+WSNvDI6PHZKvHbQpyW+T3dmBJTanLWxbyxbj6QEroG3wjQRbhDlaxeeuU5ycmd6Y=',
  scannerId: E2E_DEFAULT_LOCATION_SCANNER,
  timestamp: Number.parseInt(Date.now() / 1000, 10),
  traceId: E2E_DYNAMIC_TRACE_ID,
};

export const formTraceDataPayload = {
  traceId: E2E_FORM_TRACE_ID,
  scannerId: E2E_DEFAULT_LOCATION_SCANNER,
  locationId: E2E_DEFAULT_LOCATION_UUID,
  timestamp: Number.parseInt(Date.now() / 1000, 10),
  data:
    '/1/wt5WkIbVcPlzq+dF+ELMJaGBiA0ufzIjKbFKlSuKGDvEQBskHemi48bzhAd/97pmlYkHtYUB+8MFGc7pZgaJNGa1SmCLuYcJ6',
  publicKey:
    'BAY4szOcZkSJjJUShurqWo1SMJ7yst+++Tl8P/5XKYWdRcOyeLPuthr9uGvPlt5xfOqwPNliinz5HiPHZ643vl0=',
  iv: 'YgyJXzO2mwUmi1EHKVUlBg==',
  mac: 'wgCeNczYMh69q+ysje7DKG6XcoWLO0g5UbSmCT1XEUI=',
  deviceType: DEVICE_TYPE_FORM,
};
