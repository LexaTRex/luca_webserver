import moment from 'moment';

export const getFormattedDate = timestamp => {
  return moment.unix(timestamp).format('DD.MM.YYYY');
};

export const getFormattedTime = timestamp => {
  return moment.unix(timestamp).format('HH:mm');
};

export const sortByTimeAsc = locations =>
  locations.sort((a, b) => {
    if (a.time[0] === b.time[0]) return 0;
    return a.time[0] < b.time[0] ? 1 : -1;
  });
