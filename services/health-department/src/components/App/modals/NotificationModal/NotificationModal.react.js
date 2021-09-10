import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm, notification } from 'antd';
import { useQuery, useQueryClient } from 'react-query';
import {
  notifyLocationGuests,
  notifyLocationTracesGuests,
  getNotificationConfig,
  getContactPersons,
  getWarningLevelsForLocationTransfer,
} from 'network/api';
import { formattedTimeLabel } from 'utils/time';
import { useModal } from 'components/hooks/useModal';
import { PrimaryButton } from 'components/general';
import { RISK_LEVEL_2, RISK_LEVEL_3 } from 'constants/riskLevels';
import { filterByDeviceType } from '../ContactPersonsModal/ContactPersons/Notify/Notify.helper';
import {
  Wrapper,
  SectionTitle,
  Section,
  ButtonWrapper,
  SwitchDescription,
  StyledSwitch,
  SwitchWrapper,
  Warning,
} from './NotificationModal.styled';
import {
  filterLevel3RiskLevels,
  getLocaleObject,
} from './NotificationModal.helper';

// eslint-disable-next-line complexity
export const NotificationModal = ({
  locationName,
  locationTransferId,
  traceIds,
  time,
  departmentId,
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();
  const [level, setLevel] = useState(traceIds ? RISK_LEVEL_3 : RISK_LEVEL_2);

  const setRiskLevel2 = checked =>
    checked ? setLevel(RISK_LEVEL_2) : setLevel(RISK_LEVEL_3);

  const setRiskLevel3 = checked =>
    checked ? setLevel(RISK_LEVEL_3) : setLevel(RISK_LEVEL_2);

  const { data: config } = useQuery(
    'notificationConfig',
    getNotificationConfig,
    {
      refetchOnWindowFocus: false,
      staleTime: Number.POSITIVE_INFINITY,
    }
  );

  const {
    data: contactPersons,
  } = useQuery(
    `contactPersons${locationTransferId}`,
    () => getContactPersons(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  const {
    data: riskLevels,
  } = useQuery(
    `getWarningLevelsForLocationTransfer${locationTransferId}`,
    () => getWarningLevelsForLocationTransfer(locationTransferId),
    { refetchOnWindowFocus: false }
  );

  const triggerNotificationError = () =>
    notification.error({
      message: intl.formatMessage({
        id: 'notification.notification.error',
      }),
    });

  if (!config || !contactPersons || !riskLevels) return null;

  const contactPersonFiltered = filterByDeviceType(contactPersons.traces);

  const notify = () => {
    const notificationRequest =
      level === RISK_LEVEL_2
        ? notifyLocationGuests(locationTransferId)
        : notifyLocationTracesGuests({
            traceIds:
              traceIds || contactPersonFiltered.map(trace => trace.traceId),
            locationTransferId,
          });

    notificationRequest
      .then(response => {
        if (response.status === 204) {
          notification.success({
            message: intl.formatMessage({
              id: 'notification.notification.success',
            }),
          });
          queryClient.invalidateQueries(
            `getWarningLevelsForLocationTransfer${locationTransferId}`
          );
          closeModal();
          return;
        }
        triggerNotificationError();
      })
      .catch(() => triggerNotificationError());
  };

  const localeObject = getLocaleObject(config, departmentId, level, intl);
  const level3TraceIds = filterLevel3RiskLevels(
    traceIds || contactPersonFiltered.map(trace => trace.traceId),
    riskLevels
  );
  const wasLevel2Triggered = riskLevels.some(traceRisk =>
    traceRisk.riskLevels.includes(RISK_LEVEL_2)
  );
  const isButtonDisabled =
    level3TraceIds.length === 0 && level === RISK_LEVEL_3;

  return (
    <Wrapper>
      <SectionTitle>
        {intl.formatMessage(
          { id: 'modal.notification.section1.title' },
          { locationName }
        )}
      </SectionTitle>
      <Section>
        {intl.formatMessage({ id: 'modal.notification.section1' })}
      </Section>

      {!wasLevel2Triggered && (
        <Section>
          <SwitchWrapper>
            <StyledSwitch
              checked={level === RISK_LEVEL_2}
              onChange={setRiskLevel2}
            />
            <SwitchDescription>
              {intl.formatMessage({
                id: 'modal.notification.selection.potentialInfectionRisk',
              })}
            </SwitchDescription>
          </SwitchWrapper>
          <SwitchWrapper>
            <StyledSwitch
              checked={level === RISK_LEVEL_3}
              onChange={setRiskLevel3}
            />
            <SwitchDescription>
              {intl.formatMessage({
                id: 'modal.notification.selection.elevatedInfectionRisk',
              })}
            </SwitchDescription>
          </SwitchWrapper>
        </Section>
      )}

      {traceIds && level === RISK_LEVEL_2 && (
        <Warning>
          {intl.formatMessage({ id: 'modal.notification.selectionWarning' })}
        </Warning>
      )}

      <SectionTitle>
        {intl.formatMessage({ id: 'modal.notification.section2.title' })}
      </SectionTitle>
      <Section>
        {intl.formatMessage(
          {
            id: 'localeObject.messages.title',
            defaultMessage: localeObject.messages.title,
          },
          { br: <br /> }
        )}
      </Section>
      <Section>
        {intl.formatMessage(
          {
            id: 'localeObject.messages.message',
            defaultMessage: localeObject.messages.message,
          },
          {
            br: <br />,
            name: localeObject.healthDepartmentName,
            phone:
              localeObject.phone ||
              intl.formatMessage({ id: 'modal.notification.notSpecified' }),
            email:
              localeObject.email ||
              intl.formatMessage({ id: 'modal.notification.notSpecified' }),
          }
        )}
      </Section>

      <SectionTitle>
        {intl.formatMessage({ id: 'modal.notification.section3.title' })}
      </SectionTitle>
      <Section>
        {intl.formatMessage(
          { id: 'modal.notification.section3' },
          {
            br: <br />,
            locationName,
            from: formattedTimeLabel(time[0]),
            till: formattedTimeLabel(time[1]),
          }
        )}
      </Section>
      <SectionTitle>
        {intl.formatMessage(
          { id: 'modal.notification.section4.title' },
          {
            guestCount:
              level === RISK_LEVEL_2
                ? contactPersonFiltered.length
                : level3TraceIds.length,
          }
        )}
      </SectionTitle>
      <SectionTitle>
        {intl.formatMessage(
          { id: 'modal.notification.selection.countNoNotification' },
          {
            amount: contactPersons.traces.length - contactPersonFiltered.length,
          }
        )}
      </SectionTitle>
      <ButtonWrapper>
        {isButtonDisabled ? (
          <PrimaryButton disabled>
            {intl.formatMessage({
              id: 'modal.notification.button.alreadyNotified',
            })}
          </PrimaryButton>
        ) : (
          <Popconfirm
            placement="top"
            onConfirm={notify}
            title={intl.formatMessage(
              {
                id: 'modal.notification.confirmation',
              },
              {
                guestCount:
                  level === RISK_LEVEL_2
                    ? contactPersonFiltered.length
                    : level3TraceIds.length,
              }
            )}
            okText={intl.formatMessage({
              id: 'modal.notification.confirmButton',
            })}
            cancelText={intl.formatMessage({
              id: 'modal.dataRequest.declineButton',
            })}
          >
            <PrimaryButton>
              {intl.formatMessage({ id: 'modal.notification.button' })}
            </PrimaryButton>
          </Popconfirm>
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};
