import React from 'react';
import { useIntl } from 'react-intl';
import { formattedTimeLabel } from 'utils/time';

import { SectionTitle, Section } from '../NotificationModal.styled';

export const NotificationTime = ({ locationName, time }) => {
  const intl = useIntl();
  return (
    <>
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
    </>
  );
};
