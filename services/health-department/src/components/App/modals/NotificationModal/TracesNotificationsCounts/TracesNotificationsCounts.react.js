import React from 'react';
import { useIntl } from 'react-intl';

import { SectionTitle } from '../NotificationModal.styled';

export const TracesNotificationsCounts = ({
  amountOfNonNotifyableTraces,
  amountOfNotifyableTraces,
}) => {
  const intl = useIntl();
  return (
    <>
      <SectionTitle>
        {intl.formatMessage(
          { id: 'modal.notification.section4.title' },
          {
            guestCount: amountOfNotifyableTraces,
          }
        )}
      </SectionTitle>
      {amountOfNonNotifyableTraces !== 0 && (
        <SectionTitle>
          {intl.formatMessage(
            { id: 'modal.notification.selection.countNoNotification' },
            {
              amount: amountOfNonNotifyableTraces,
            }
          )}
        </SectionTitle>
      )}
    </>
  );
};
