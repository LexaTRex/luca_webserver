import { CHECK_OUT_LOCATION_TYPE, CHECK_OUT_PATH } from 'constants/routes';

export function getCheckOutPath(
  traceId = null,
  type = CHECK_OUT_LOCATION_TYPE
) {
  const search = new URLSearchParams();
  search.set('traceId', traceId);
  search.set('type', type);
  return `${CHECK_OUT_PATH}?${search.toString()}`;
}
