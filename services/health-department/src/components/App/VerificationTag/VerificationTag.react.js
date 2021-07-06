import React from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';

// Api
import { getHealthDepartment, getMe } from 'network/api';

// Assets
import { ReactComponent as VerificationSVG } from 'assets/verification.svg';

import { IconWrapper } from './VerificationTag.styled';

const VerificationIcon = () => (
  <Icon component={VerificationSVG} style={{ fontSize: 16 }} />
);

export const VerificationTag = () => {
  const intl = useIntl();

  const { isLoading, error, data: healthDepartment } = useQuery(
    'healthDepartment',
    () =>
      getMe().then(response => {
        return getHealthDepartment(response.departmentId);
      })
  );

  if (
    isLoading ||
    error ||
    !healthDepartment.signedPublicHDEKP ||
    !healthDepartment.signedPublicHDSKP
  )
    return null;

  return (
    <Tooltip title={intl.formatMessage({ id: 'verificationTag.info' })}>
      <IconWrapper>
        <VerificationIcon />
      </IconWrapper>
    </Tooltip>
  );
};
