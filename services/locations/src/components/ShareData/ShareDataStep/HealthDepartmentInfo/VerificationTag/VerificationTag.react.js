import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';

// Assets
import { ReactComponent as VerificationSVG } from 'assets/verification.svg';

import { IconWrapper } from './VerificationTag.styled';

const VerificationIcon = () => (
  <Icon component={VerificationSVG} style={{ fontSize: 16 }} />
);

export const VerificationTag = ({ healthDepartment }) => {
  const intl = useIntl();

  if (!healthDepartment.signedPublicHDEKP) return null;

  return (
    <Tooltip title={intl.formatMessage({ id: 'verificationTag.info' })}>
      <IconWrapper>
        <VerificationIcon />
      </IconWrapper>
    </Tooltip>
  );
};
