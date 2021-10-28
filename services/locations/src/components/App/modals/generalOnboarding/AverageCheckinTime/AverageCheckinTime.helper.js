import { notification } from 'antd';
import { getMinutesFromTimeString } from 'utils/time';

export const timeDiffValidator = (averageCheckinTime, next, intl) => {
  if (averageCheckinTime !== null) {
    if (getMinutesFromTimeString(averageCheckinTime) >= 15) {
      next();
    } else {
      notification.error({
        message: intl.formatMessage({
          id: 'notification.updateAverageCheckinTime.TimeError',
        }),
      });
    }
  } else {
    next();
  }
};
