import moment from 'moment';

const HOUR_IN_MINUTES = 60;

export const getFormattedDate = timestamp =>
  timestamp ? moment.unix(timestamp).format('DD.MM.YYYY') : '';

export const getFormattedTime = timestamp =>
  timestamp ? moment.unix(timestamp).format('HH:mm') : '';

export const getMinutesFromTimeString = timeString => {
  const hours = moment(timeString, 'HH:mm').hours();
  const minutes = moment(timeString, 'HH:mm').minutes();
  return hours * HOUR_IN_MINUTES + minutes;
};

export const setAverageCheckoutTime = (time, form) => {
  form.setFieldsValue({
    averageCheckinTime: time,
  });
};
