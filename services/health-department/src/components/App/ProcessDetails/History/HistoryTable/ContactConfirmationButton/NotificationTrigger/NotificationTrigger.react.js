import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { useQuery } from 'react-query';

import { RISK_LEVEL_2, RISK_LEVEL_3 } from 'constants/riskLevels';
import { NOTIFIEABLE_DEVICE_TYPES } from 'constants/deviceTypes';

import {
  getWarningLevelsForLocationTransfer,
  getContactPersons,
  getMe,
} from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { NotificationModal } from 'components/App/modals/NotificationModal';

import { BellIcon, ButtonWrapper } from './NotificationTrigger.styled';

const checkIfAnyContactPersonsAreNotifyable = (contactPersons, riskLevels) => {
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

export const NotificationTrigger = ({ location }) => {
  const intl = useIntl();
  const [openModal] = useModal();
  const {
    uuid: locationId,
    name: locationName,
    transferId: locationTransferId,
    time,
  } = location;

  const {
    data: riskLevels,
  } = useQuery(
    `getWarningLevelsForLocationTransfer${locationTransferId}`,
    () => getWarningLevelsForLocationTransfer(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  const {
    data: contactPersons,
  } = useQuery(
    `contactPersons${locationTransferId}`,
    () => getContactPersons(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  const { data: healthDepartmentEmployee } = useQuery('me', getMe, {
    refetchOnWindowFocus: false,
  });

  const openNotificationModal = () =>
    openModal({
      title: intl.formatMessage({
        id: 'modal.notification.title',
      }),
      content: (
        <NotificationModal
          locationId={locationId}
          locationName={locationName}
          locationTransferId={locationTransferId}
          time={time}
          departmentId={healthDepartmentEmployee.departmentId}
        />
      ),
      wide: true,
    });

  if (
    !riskLevels ||
    !contactPersons ||
    !healthDepartmentEmployee ||
    !healthDepartmentEmployee.notificationsEnabled
  )
    return null;

  const isNotificationEnabled = checkIfAnyContactPersonsAreNotifyable(
    contactPersons,
    riskLevels
  );

  return (
    <ButtonWrapper
      onClick={isNotificationEnabled ? openNotificationModal : () => {}}
    >
      <Tooltip title={intl.formatMessage({ id: 'modal.notification.button' })}>
        <BellIcon disabled={!isNotificationEnabled} />
      </Tooltip>
    </ButtonWrapper>
  );
};
