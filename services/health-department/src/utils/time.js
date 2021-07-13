import moment from 'moment';

export const getFormattedDate = timestamp =>
  moment.unix(timestamp).format('DD.MM.YYYY');

export const getFormattedTime = timestamp =>
  moment.unix(timestamp).format('HH:mm');

export const getFormattedDateTime = timestamp =>
  `${getFormattedDate(timestamp)} ${getFormattedTime(timestamp)}`;

export const sortByTimeAsc = locations =>
  locations.sort((a, b) => {
    if (a.time[0] === b.time[0]) return 0;
    return a.time[0] < b.time[0] ? 1 : -1;
  });
