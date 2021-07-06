import {
  CHECK_OUT_PATH,
  CHECK_OUT_LOCATION_TYPE,
  BASE_PRIVATE_MEETING_PATH,
} from 'constants/routes';

export function getCheckOutPath(
  traceId = null,
  type = CHECK_OUT_LOCATION_TYPE
) {
  const search = new URLSearchParams();
  search.set('traceId', traceId);
  search.set('type', type);
  return `${CHECK_OUT_PATH}?${search.toString()}`;
}

export function getPrivateMeetingCheckInRoute(scannerId, hash) {
  return `${BASE_PRIVATE_MEETING_PATH}/${scannerId}${hash}`;
}
