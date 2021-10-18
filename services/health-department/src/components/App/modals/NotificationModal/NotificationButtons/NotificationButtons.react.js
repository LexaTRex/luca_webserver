import React from 'react';
import { useIntl } from 'react-intl';
import { Popconfirm, notification } from 'antd';
import { useQueryClient } from 'react-query';

import { notifyLocationTracesGuests } from 'network/api';

import { useModal } from 'components/hooks/useModal';
import { PrimaryButton } from 'components/general';

import { ButtonWrapper } from './NotificationButtons.styled';

export const NotificationButtons = ({
  amountOfNotifyableTraces,
  level,
  locationTransferId,
  traceIdsToNotify,
}) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const [, closeModal] = useModal();

  const triggerNotificationError = () =>
    notification.error({
      message: intl.formatMessage({
        id: 'notification.notification.error',
      }),
    });

  const notify = () => {
    const notificationRequest = notifyLocationTracesGuests({
      traceIds: traceIdsToNotify,
      locationTransferId,
      riskLevel: level,
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
  return (
    <ButtonWrapper>
      {amountOfNotifyableTraces === 0 ? (
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
              guestCount: traceIdsToNotify.length,
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
  );
};
