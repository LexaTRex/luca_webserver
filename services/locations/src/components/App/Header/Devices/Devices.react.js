import React from 'react';
import { useIntl } from 'react-intl';
import Icon from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';

import { DEVICES_ROUTE } from 'constants/routes';

import { ReactComponent as DeviceActiveSvg } from 'assets/DeviceActive.svg';
import { ReactComponent as DeviceDefaultSvg } from 'assets/DeviceDefault.svg';

import { DevicesComp } from './Devices.styled';

const DeviceIcon = isActive => (
  <Icon
    component={isActive ? DeviceActiveSvg : DeviceDefaultSvg}
    style={{ fontSize: 32 }}
  />
);

export function Devices() {
  const intl = useIntl();
  const history = useHistory();
  const currentRoute = useLocation();

  const isDeviceRoute = currentRoute.pathname === DEVICES_ROUTE;

  const navigate = () => {
    history.push(DEVICES_ROUTE);
  };

  return (
    <DevicesComp
      onClick={navigate}
      title={intl.formatMessage({ id: 'device.title' })}
    >
      {DeviceIcon(isDeviceRoute)}
    </DevicesComp>
  );
}
