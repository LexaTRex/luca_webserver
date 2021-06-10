import moment from 'moment';

export const waitingPeriodDays = 28;

export const calculateDaysRemaining = operator => {
  return moment
    .unix(operator.deletedAt)
    .add(waitingPeriodDays, 'days')
    .diff(moment(), 'days');
};
