import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';

// Assets
import { ReactComponent as RequestWarningSVG } from 'assets/warning.svg';

import { IconWrapper } from './RequestWarning.styled';

const RequestWarningIcon = () => (
  <Icon component={RequestWarningSVG} style={{ fontSize: 16 }} />
);

export const RequestWarning = () => {
  const intl = useIntl();

  return (
    <Tooltip title={intl.formatMessage({ id: 'requestWarning.info' })}>
      <IconWrapper>
        <RequestWarningIcon />
      </IconWrapper>
    </Tooltip>
  );
};
