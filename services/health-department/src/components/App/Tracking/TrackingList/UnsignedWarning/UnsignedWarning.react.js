import React from 'react';
import { useIntl } from 'react-intl';

import {
  HEALTH_DEPARTMENT_SUPPORT_EMAIL,
  HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER,
} from 'constants/environment';

import { Wrapper, Card, Title, Text } from './UnsignedWarning.styled';

export const UnsignedWarning = () => {
  const intl = useIntl();
  return (
    <Wrapper>
      <Card>
        <Title>{intl.formatMessage({ id: 'unsignedWarning.title' })}</Title>
        <Text>
          {intl.formatMessage(
            { id: 'unsignedWarning.description' },
            {
              br: <br />,
              phone: HEALTH_DEPARTMENT_SUPPORT_PHONE_NUMBER,
              email: HEALTH_DEPARTMENT_SUPPORT_EMAIL,
            }
          )}
        </Text>
      </Card>
    </Wrapper>
  );
};
