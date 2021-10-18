import React from 'react';
import { useIntl } from 'react-intl';

import { SectionTitle, Section } from '../NotificationModal.styled';

export const CustomHealthDepartmentMessage = ({ localeObject }) => {
  const intl = useIntl();
  return (
    <>
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
    </>
  );
};
