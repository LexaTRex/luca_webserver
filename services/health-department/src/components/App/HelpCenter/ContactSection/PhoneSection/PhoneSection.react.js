import React from 'react';
import { useIntl } from 'react-intl';

import { HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER } from 'constants/environment';
import { Wrapper, StyledPhoneOutlined } from './PhoneSection.styled';
import { Heading, Text } from '../MailSection/MailSection.styled';

export const PhoneSection = () => {
  const intl = useIntl();
  return (
    <Wrapper>
      <StyledPhoneOutlined rotate={90} />
      <Heading>
        {intl.formatMessage({ id: 'helpCenter.phone.heading' })}
      </Heading>
      <Text>{intl.formatMessage({ id: 'helpCenter.phone.text' })}</Text>
      <Heading>{HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER}</Heading>
    </Wrapper>
  );
};
