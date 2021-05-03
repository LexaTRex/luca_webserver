import moment from 'moment';

export const formattedTimeLabel = (
  timestamp,
  format = 'DD.MM.YYYY - HH:mm'
) => {
  return `${moment.unix(timestamp).format(format)}`;
};

export const formattedContactInfo = (firstName, lastName) =>
  `${firstName} ${lastName}`;
