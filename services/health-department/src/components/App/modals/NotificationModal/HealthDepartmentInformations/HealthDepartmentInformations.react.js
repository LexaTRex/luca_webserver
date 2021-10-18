import React from 'react';
import { useIntl } from 'react-intl';

import { Section } from '../NotificationModal.styled';

export const HealthDepartmentInformations = ({ localeObject }) => {
  const intl = useIntl();
  return (
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
  );
};
