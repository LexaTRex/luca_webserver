import { NOTIFIEABLE_DEVICE_TYPES } from 'constants/deviceTypes';

export const filterByDeviceType = contactPersons =>
  contactPersons.filter(
    contact =>
      contact.deviceType === NOTIFIEABLE_DEVICE_TYPES.IOS ||
      contact.deviceType === NOTIFIEABLE_DEVICE_TYPES.ANDROID
  );

export const filterRiskLevels = (traceIdsToFilter, riskLevels, level) =>
  traceIdsToFilter.filter(traceId =>
    riskLevels.some(
      riskLevel =>
        riskLevel.traceId === traceId && !riskLevel.riskLevels.includes(level)
    )
  );

export const getLocaleObject = (localeConfig, departmentId, level, intl) => {
  const departmentInfo = localeConfig.departments.find(
    departmentMessageObject => departmentMessageObject.uuid === departmentId
  );

  const departmentMessages = departmentInfo.config[level]
    ? departmentInfo.config[level].messages
    : localeConfig.default[level].messages;

  const localizeddepartmentMessages =
    intl.locale === 'de' ? departmentMessages.de : departmentMessages.en;

  for (const [key, value] of Object.entries(localizeddepartmentMessages)) {
    localizeddepartmentMessages[key] = value
      .replaceAll('((', '{')
      .replaceAll('))', '}')
      .replaceAll(/^\s*\n/gm, '{br}')
      .replaceAll('\n', '{br}');
  }
  return {
    messages: localizeddepartmentMessages,
    healthDepartmentName: departmentInfo.name,
    email: departmentInfo.email,
    phone: departmentInfo.phone,
  };
};
