import { getMinutesFromTimeString } from 'utils/time';

export const RESTAURANT_TYPE = 'restaurant';
export const ROOM_TYPE = 'room';
export const BUILDING_TYPE = 'building';
export const BASE_TYPE = 'base';

export const SELECT_LOCATION_STEP = 'SELECT_LOCATION_STEP';
export const NAME_INPUT_STEP = 'NAME_INPUT_STEP';
export const ADDRESS_INPUT_STEP = 'ADDRESS_INPUT_STEP';
export const PHONE_INPUT_STEP = 'PHONE_INPUT_STEP';
export const TABLE_INPUT_STEP = 'TABLE_INPUT_STEP';
export const AUTOMATIC_CHECKOUT_STEP = 'AUTOMATIC_CHECKOUT_STEP';
export const AVERAGE_CHECKIN_TIME_STEP = 'AVERAGE_CHECKIN_TIME_STEP';
export const COMPLETE_STEP = 'COMPLETE_STEP';
export const QR_CODES_STEP = 'QR_CODES_STEP';
export const IS_INDOOR_STEP = 'IS_INDOOR_STEP';

export const BASE_ADDRESS_INDICATOR = 'BASE_ADDRESS_INDICATOR';

export const getRestaurantLocationPayload = (
  groupId,
  locationName,
  phone,
  address,
  baseLocation,
  radius,
  tableCount,
  locationType,
  isIndoor,
  averageCheckinTime
) => {
  const isSameAddress = address === BASE_ADDRESS_INDICATOR;

  return {
    groupId,
    locationName,
    phone,
    streetName: isSameAddress ? baseLocation.streetName : address.streetName,
    streetNr: isSameAddress ? baseLocation.streetNr : address.streetNr,
    zipCode: isSameAddress ? baseLocation.zipCode : address.zipCode,
    city: isSameAddress ? baseLocation.city : address.city,
    state: isSameAddress ? baseLocation.state : address.state,
    lat: isSameAddress ? baseLocation.lat : address.lat,
    lng: isSameAddress ? baseLocation.lng : address.lng,
    radius: radius ? parseInt(radius, 10) : 0,
    tableCount: tableCount ? parseInt(tableCount, 10) : null,
    type: locationType,
    isIndoor,
    averageCheckinTime: getMinutesFromTimeString(averageCheckinTime),
  };
};

export const getBaseLocationPayload = (
  groupId,
  locationName,
  phone,
  address,
  baseLocation,
  radius,
  locationType,
  isIndoor,
  averageCheckinTime
) => {
  const isSameAddress = address === BASE_ADDRESS_INDICATOR;

  return {
    groupId,
    locationName,
    phone,
    streetName: isSameAddress ? baseLocation.streetName : address.streetName,
    streetNr: isSameAddress ? baseLocation.streetNr : address.streetNr,
    zipCode: isSameAddress ? baseLocation.zipCode : address.zipCode,
    city: isSameAddress ? baseLocation.city : address.city,
    state: isSameAddress ? baseLocation.state : address.state,
    lat: isSameAddress ? baseLocation.lat : address.lat,
    lng: isSameAddress ? baseLocation.lng : address.lng,
    radius: radius ? parseInt(radius, 10) : 0,
    tableCount: null,
    type: locationType,
    isIndoor,
    averageCheckinTime: getMinutesFromTimeString(averageCheckinTime),
  };
};
