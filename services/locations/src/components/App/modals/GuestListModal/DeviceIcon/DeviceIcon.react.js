import React from 'react';

import { useIntl } from 'react-intl';
import { Tooltip } from 'antd';
import {
  MobileOutlined,
  QrcodeOutlined,
  ContainerOutlined,
} from '@ant-design/icons';

export const DeviceIcon = ({ deviceType }) => {
  const intl = useIntl();

  if (deviceType === 0 || deviceType === 1 || deviceType === 3) {
    return (
      <Tooltip
        placement="top"
        title={intl.formatMessage({
          id: 'modal.guestList.deviceType.app',
        })}
      >
        <MobileOutlined />
      </Tooltip>
    );
  }

  if (deviceType === 2) {
    return (
      <Tooltip
        placement="top"
        title={intl.formatMessage({
          id: 'modal.guestList.deviceType.badge',
        })}
      >
        <QrcodeOutlined />
      </Tooltip>
    );
  }

  return (
    <Tooltip
      placement="top"
      title={intl.formatMessage({
        id: 'modal.guestList.deviceType.contactForm',
      })}
    >
      <ContainerOutlined />
    </Tooltip>
  );
};
