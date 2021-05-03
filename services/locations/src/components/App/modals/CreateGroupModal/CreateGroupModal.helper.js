export const RESTAURANT_TYPE = 'restaurant';
export const NURSING_HOME_TYPE = 'nursing_home';
export const HOTEL_TYPE = 'hotel';
export const STORE_TYPE = 'store';
export const BASE_TYPE = 'base';

export const SELECT_GROUP_STEP = 'SELECT_GROUP_STEP';
export const NAME_INPUT_STEP = 'NAME_INPUT_STEP';
export const ADDRESS_INPUT_STEP = 'ADDRESS_INPUT_STEP';
export const PHONE_INPUT_STEP = 'PHONE_INPUT_STEP';
export const TABLE_INPUT_STEP = 'TABLE_INPUT_STEP';
export const AUTOMATIC_CHECKOUT_STEP = 'AUTOMATIC_CHECKOUT_STEP';
export const COMPLETE_STEP = 'COMPLETE_STEP';
export const QR_CODES_STEP = 'QR_CODES_STEP';
export const PATIENT_STEP = 'PATIENT_STEP';
export const AREA_SELECTION_STEP = 'AREA_SELECTION_STEP';
export const IS_INDOOR_STEP = 'IS_INDOOR';

export const getRestaurantGroupPayload = (
  groupName,
  phone,
  address,
  radius,
  tableCount,
  groupType,
  isIndoor
) => ({
  type: groupType,
  name: groupName,
  phone,
  streetName: address.streetName,
  streetNr: address.streetNr,
  zipCode: address.zipCode,
  city: address.city,
  state: address.state,
  lat: address.lat,
  lng: address.lng,
  radius: radius ? parseInt(radius, 10) : 0,
  tableCount: tableCount ? parseInt(tableCount, 10) : null,
  isIndoor,
});

export const getNursingHomeGroupPayload = (
  intl,
  groupName,
  phone,
  address,
  radius,
  patientRequired,
  groupType,
  isIndoor
) => ({
  type: groupType,
  name: groupName,
  phone,
  streetName: address.streetName,
  streetNr: address.streetNr,
  zipCode: address.zipCode,
  city: address.city,
  state: address.state,
  lat: address.lat,
  lng: address.lng,
  radius: radius ? parseInt(radius, 10) : 0,
  tableCount: null,
  additionalData: patientRequired
    ? [
        {
          key: intl.formatMessage({ id: 'nursingHome.patientName' }),
          isRequired: true,
        },
      ]
    : [],
  isIndoor,
});

export const getBaseGroupPayload = (
  groupName,
  phone,
  address,
  radius,
  areas,
  groupType,
  isIndoor
) => ({
  type: groupType,
  name: groupName,
  phone,
  streetName: address.streetName,
  streetNr: address.streetNr,
  zipCode: address.zipCode,
  city: address.city,
  state: address.state,
  lat: address.lat,
  lng: address.lng,
  radius: radius ? parseInt(radius, 10) : 0,
  areas,
  isIndoor,
});
