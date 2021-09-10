import { RISK_LEVEL_3 } from 'constants/riskLevels';

export const filterLevel3RiskLevels = (traceIdsToFilter, riskLevels) =>
  traceIdsToFilter.filter(traceId =>
    riskLevels.some(
      riskLevel =>
        riskLevel.traceId === traceId &&
        !riskLevel.riskLevels.includes(RISK_LEVEL_3)
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
