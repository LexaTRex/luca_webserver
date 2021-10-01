import { NOTIFIEABLE_DEVICE_TYPES } from 'constants/deviceTypes';
import { RISK_LEVEL_2, RISK_LEVEL_3 } from 'constants/riskLevels';

export const checkIfAnyContactPersonsAreNotifyable = (
  contactPersons,
  riskLevels
) => {
  const allowedDeviceTypes = new Set([
    NOTIFIEABLE_DEVICE_TYPES.IOS,
    NOTIFIEABLE_DEVICE_TYPES.ANDROID,
  ]);
  const riskLevelsToCheck = [RISK_LEVEL_2, RISK_LEVEL_3];

  const tracesOfNotifyableDevices = contactPersons.traces.filter(
    contactPerson => allowedDeviceTypes.has(contactPerson.deviceType)
  );
  return tracesOfNotifyableDevices.some(({ traceId }) => {
    const riskLevelsForTrace = riskLevels.find(
      riskLevel => riskLevel.traceId === traceId
    );
    if (!riskLevelsForTrace.riskLevels.length) return true;
    return riskLevelsToCheck.some(
      level => !riskLevelsForTrace.riskLevels.includes(level)
    );
  });
};
