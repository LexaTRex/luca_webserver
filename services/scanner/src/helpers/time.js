import moment from 'moment';
import { getTimesync } from 'network/api';
import { MAX_TIME_DIFF_MS } from 'constants/timesync';

export const isLocalTimeCorrect = async () => {
  const { unix } = await getTimesync().then(response => response.json());
  const localServerTimeDiff = moment().unix() - unix;

  return localServerTimeDiff <= MAX_TIME_DIFF_MS;
};
