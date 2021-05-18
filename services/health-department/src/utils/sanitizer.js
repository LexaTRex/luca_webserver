import { pick } from 'lodash';
import {
  assertStringOrNumericValues,
  escapeProblematicCharacters,
} from './typeAssertions';

const staticDeviceDataPropertyNames = [
  'fn',
  'ln',
  'pn',
  'e',
  'st',
  'hn',
  'pc',
  'c',
  'vs',
  'v',
];

const dynamicDevicePropertyNames = [
  'fn',
  'ln',
  'pn',
  'e',
  'st',
  'hn',
  'pc',
  'c',
  'v',
];

export function filterTraceData(userData, isDynamicDevice) {
  const picked = escapeProblematicCharacters(
    pick(
      userData,
      isDynamicDevice
        ? dynamicDevicePropertyNames
        : staticDeviceDataPropertyNames
    )
  );
  assertStringOrNumericValues(picked);
  return picked;
}
