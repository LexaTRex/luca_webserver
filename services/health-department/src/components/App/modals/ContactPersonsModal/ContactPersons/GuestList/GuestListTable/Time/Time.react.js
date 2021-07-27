import React from 'react';

import { getFormattedTime, getFormattedDate } from 'utils/time';

export const Time = ({ time }) => (
  <div>{time ? `${getFormattedDate(time)} ${getFormattedTime(time)}` : ''}</div>
);
