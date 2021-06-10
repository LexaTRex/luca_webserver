import {
  UNKNOWN_TEST_RESULT,
  PCR_COVID_TEST_TYPE,
  FAST_COVID_TEST_TYPE,
  NEGATIVE_TEST_RESULT,
  POSITIVE_TEST_RESULT,
  UNKNOWN_COVID_TEST_TYPE,
} from 'constants/covid';

export function getTestResultFromQRCode(result) {
  switch (result) {
    case 'p':
      return POSITIVE_TEST_RESULT;
    case 'n':
      return NEGATIVE_TEST_RESULT;
    default:
      return UNKNOWN_TEST_RESULT;
  }
}
export function getTestTypeFromQRCode(type) {
  switch (type) {
    case 'f':
      return FAST_COVID_TEST_TYPE;
    case 'p':
      return PCR_COVID_TEST_TYPE;
    default:
      return UNKNOWN_COVID_TEST_TYPE;
  }
}
