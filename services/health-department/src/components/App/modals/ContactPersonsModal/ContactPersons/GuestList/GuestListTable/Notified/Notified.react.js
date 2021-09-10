import React from 'react';
import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import { ReactComponent as BellSvg } from 'assets/BellIcon.svg';

export const Notified = () => {
  const intl = useIntl();
  return (
    <Tooltip title={intl.formatMessage({ id: 'contactperson.notified' })}>
      <Icon
        component={BellSvg}
        style={{
          color: 'black',
          fontSize: 32,
          marginLeft: 32,
        }}
      />
    </Tooltip>
  );
};
