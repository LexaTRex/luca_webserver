import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';

import { HELPCENTER } from '../ContactSection.helper';
import {
  Wrapper,
  SupportCode,
  StyledPhoneOutlined,
} from './PhoneSection.styled';
import { Heading, Text } from '../MailSection/MailSection.styled';

export const PhoneSection = ({ operator }) => {
  const intl = useIntl();
  return (
    <Wrapper>
      <StyledPhoneOutlined rotate={90} />
      <Heading>
        {intl.formatMessage({ id: 'helpCenter.phone.heading' })}
      </Heading>
      <Text>
        {intl.formatMessage({ id: 'helpCenter.phone.text' }, { br: <br /> })}
      </Text>
      <Tooltip placement="top" title={operator.supportCode}>
        <SupportCode>
          {intl.formatMessage({ id: 'helpCenter.phone.showSupportCode' })}
        </SupportCode>
      </Tooltip>
      <Heading>{HELPCENTER.phone}</Heading>
    </Wrapper>
  );
};
