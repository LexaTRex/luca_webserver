import moment from 'moment';

import { DEFAULT_AVERAGE_CHECKIN_TIME } from 'constants/checkout';

export const getTimeStringFromMinutes = location =>
  moment
    .utc()
    .startOf('day')
    .add({
      minutes: location.averageCheckinTime || DEFAULT_AVERAGE_CHECKIN_TIME,
    });
