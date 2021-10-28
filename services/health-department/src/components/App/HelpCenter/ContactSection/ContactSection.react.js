import React from 'react';
import { useIntl } from 'react-intl';

import { MailSection } from './MailSection';
import { PhoneSection } from './PhoneSection';
import { Wrapper, Heading } from './ContactSection.styled';

export const ContactSection = ({ profileData }) => {
  const intl = useIntl();
  return (
    <Wrapper>
      <Heading>{intl.formatMessage({ id: 'helpCenter.heading' })}</Heading>
      <MailSection profileData={profileData} />
      <PhoneSection />
    </Wrapper>
  );
};
