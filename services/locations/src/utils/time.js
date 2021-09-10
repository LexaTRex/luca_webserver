import moment from 'moment';

export const getFormattedDate = timestamp =>
  timestamp ? moment.unix(timestamp).format('DD.MM.YYYY') : '';

export const getFormattedTime = timestamp =>
  timestamp ? moment.unix(timestamp).format('HH:mm') : '';
