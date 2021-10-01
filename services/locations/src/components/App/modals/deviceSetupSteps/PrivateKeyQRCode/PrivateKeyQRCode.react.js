import React from 'react';
import QRCode from 'qrcode.react';
import { useIntl } from 'react-intl';

import { StepHeadline, StepDescription } from '../CreateDeviceModal.styled';

import {
  QRCodeWrapper,
  DeviceAuthenticationWrapper,
  DeviceAuthenticationContent,
} from './PrivateKeyQRCode.styled';

export function PrivateKeyQRCode({ privateKeyQRCode }) {
  const intl = useIntl();

  return (
    <DeviceAuthenticationWrapper>
      <StepHeadline>
        (3/4){' '}
        {intl.formatMessage({
          id: 'modal.createDevice.privateKeyQRCode',
        })}
      </StepHeadline>
      <StepDescription>
        {intl.formatMessage({
          id: 'modal.createDevice.privateKeyQRCode.description',
        })}
      </StepDescription>
      <DeviceAuthenticationContent>
        <QRCodeWrapper>
          <QRCode value={privateKeyQRCode} size={200} level="M" />
        </QRCodeWrapper>
      </DeviceAuthenticationContent>
    </DeviceAuthenticationWrapper>
  );
}
