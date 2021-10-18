import React from 'react';
import { useIntl } from 'react-intl';

import { MailSection } from './MailSection';
import { PhoneSection } from './PhoneSection';
import { Wrapper, Heading } from './ContactSection.styled';

export const ContactSection = ({ operator }) => {
  const intl = useIntl();
  return (
    <Wrapper data-cy="helpCenterContact">
      <Heading>{intl.formatMessage({ id: 'helpCenter.heading' })}</Heading>
      <MailSection operator={operator} />
      <PhoneSection operator={operator} />
    </Wrapper>
  );
};
