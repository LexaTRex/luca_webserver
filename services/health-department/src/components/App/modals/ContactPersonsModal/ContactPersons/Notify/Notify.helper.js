export const DEVICE_TYPES = {
  IOS: 0,
  ANDROID: 1,
};

export const filterByDeviceType = contactPersons =>
  contactPersons.filter(
    contact =>
      contact.deviceType === DEVICE_TYPES.IOS ||
      contact.deviceType === DEVICE_TYPES.ANDROID
  );
