import React from 'react';
import { useIntl } from 'react-intl';

import { AddDeviceButton } from '../../AddDeviceButton';

import {
  NoDeviceFoundInfo,
  NoDeviceFoundWrapper,
  NoDeviceFoundHeadline,
} from './NoDeviceFound.styled';

export function NoDeviceFound() {
  const intl = useIntl();

  return (
    <NoDeviceFoundWrapper>
      <NoDeviceFoundHeadline>
        {intl.formatMessage({ id: 'device.noDevices' })}
      </NoDeviceFoundHeadline>
      <NoDeviceFoundInfo>
        {intl.formatMessage({ id: 'device.noDevices.info' })}
      </NoDeviceFoundInfo>
      <AddDeviceButton isCentered />
    </NoDeviceFoundWrapper>
  );
}
