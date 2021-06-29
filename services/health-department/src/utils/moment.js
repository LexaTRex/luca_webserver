export const mergeTimeAndDateObject = (dateObject, timeObject) => {
  dateObject.hour(timeObject.hour());
  dateObject.minute(timeObject.minute());
  dateObject.second(timeObject.second());
  return dateObject;
};
