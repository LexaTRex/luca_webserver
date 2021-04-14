import moment from 'moment';

export const getFormattedDate = timestamp => {
  return moment.unix(timestamp).format('DD.MM.YYYY');
};

export const getFormattedTime = timestamp => {
  return moment.unix(timestamp).format('HH:mm');
};
