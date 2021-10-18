import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import {
  getNotificationConfig,
  getContactPersons,
  getWarningLevelsForLocationTransfer,
} from 'network/api';
import { RISK_LEVEL_2 } from 'constants/riskLevels';
import { Wrapper } from './NotificationModal.styled';
import {
  getLocaleObject,
  filterByDeviceType,
  filterRiskLevels,
} from './NotificationModal.helper';
import { TracesNotificationsCounts } from './TracesNotificationsCounts';
import { NotificationTime } from './NotificationTime';
import { HealthDepartmentInformations } from './HealthDepartmentInformations';
import { CustomHealthDepartmentMessage } from './CustomHealthDepartmentMessage';
import { NotificationTypeSelection } from './NotificationTypeSelection';
import { NotificationModalDescription } from './NotificationModalDescription';
import { NotificationButtons } from './NotificationButtons';

export const NotificationModal = ({
  locationName,
  locationTransferId,
  traces,
  time,
  departmentId,
}) => {
  const intl = useIntl();
  const [level, setLevel] = useState(RISK_LEVEL_2);

  const { data: config } = useQuery(
    'notificationConfig',
    getNotificationConfig,
    {
      refetchOnWindowFocus: false,
      staleTime: Number.POSITIVE_INFINITY,
    }
  );

  const { data: contactPersons } = useQuery(
    ['contactPersons', { locationTransferId }],
    () => getContactPersons(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  const { data: riskLevels } = useQuery(
    ['getWarningLevelsForLocationTransfer', { locationTransferId }],
    () => getWarningLevelsForLocationTransfer(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  if (!config || !contactPersons || !riskLevels) return null;

  const triggeredWithoutSelection = !traces;

  const localeObject = getLocaleObject(config, departmentId, level, intl);

  const filteredContactPersons = filterByDeviceType(
    triggeredWithoutSelection ? contactPersons.traces : traces
  );

  const traceIdsToNotify = filterRiskLevels(
    filteredContactPersons.map(trace => trace.traceId),
    riskLevels,
    level
  );

  const completeTracesLength = triggeredWithoutSelection
    ? contactPersons.traces.length
    : traces.length;

  const amountOfNotifyableTraces = traceIdsToNotify.length;

  const amountOfNonNotifyableTraces =
    completeTracesLength - amountOfNotifyableTraces;

  return (
    <Wrapper>
      <NotificationModalDescription locationName={locationName} />
      <NotificationTypeSelection setLevel={setLevel} level={level} />
      <CustomHealthDepartmentMessage localeObject={localeObject} />
      <HealthDepartmentInformations localeObject={localeObject} />
      <NotificationTime locationName={locationName} time={time} />
      <TracesNotificationsCounts
        amountOfNotifyableTraces={amountOfNotifyableTraces}
        amountOfNonNotifyableTraces={amountOfNonNotifyableTraces}
      />
      <NotificationButtons
        traceIdsToNotify={traceIdsToNotify}
        locationTransferId={locationTransferId}
        amountOfNotifyableTraces={amountOfNotifyableTraces}
        level={level}
      />
    </Wrapper>
  );
};
