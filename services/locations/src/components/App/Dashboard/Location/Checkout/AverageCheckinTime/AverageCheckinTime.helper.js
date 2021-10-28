import moment from 'moment';

import {
  DEFAULT_AVERAGE_CHECKIN_TIME,
  MAX_AVERAGE_CHECKIN_TIME,
  MIN_AVERAGE_CHECKIN_TIME,
} from 'constants/checkout';
import { getMinutesFromTimeString } from 'utils/time';
import { notification } from 'antd';

export const getTimeStringFromMinutes = location =>
  moment
    .utc()
    .startOf('day')
    .add({
      minutes: location.averageCheckinTime || DEFAULT_AVERAGE_CHECKIN_TIME,
    });

export const onChangeAverageCheckinTime = (
  timeString,
  intl,
  updateAverageCheckinTime
) => {
  const averageCheckinTimeMinutes = getMinutesFromTimeString(timeString);

  if (
    averageCheckinTimeMinutes >= MAX_AVERAGE_CHECKIN_TIME ||
    averageCheckinTimeMinutes <= MIN_AVERAGE_CHECKIN_TIME
  ) {
    notification.error({
      message: intl.formatMessage({
        id: 'notification.updateAverageCheckinTime.constraint.error',
      }),
    });
    return;
  }
  updateAverageCheckinTime(getMinutesFromTimeString(timeString));
};
