import React from 'react';
import { useIntl } from 'react-intl';

import { SectionTitle, Section } from '../NotificationModal.styled';

export const NotificationModalDescription = ({ locationName }) => {
  const intl = useIntl();
  return (
    <>
      <SectionTitle>
        {intl.formatMessage(
          { id: 'modal.notification.section1.title' },
          { locationName }
        )}
      </SectionTitle>
      <Section>
        {intl.formatMessage({ id: 'modal.notification.section1' })}
      </Section>
    </>
  );
};
