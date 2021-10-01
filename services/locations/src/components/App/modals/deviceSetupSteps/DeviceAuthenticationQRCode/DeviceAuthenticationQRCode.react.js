import React from 'react';

import QRCode from 'qrcode.react';
import { useIntl } from 'react-intl';

import { StepHeadline, StepDescription } from '../CreateDeviceModal.styled';
import {
  QRCodeWrapper,
  DeviceAuthenticationWrapper,
  DeviceAuthenticationContent,
} from './DeviceAuthenticationQRCode.styled';

export function DeviceAuthenticationQRCode({
  currentStep,
  numberOfSteps,
  authenticationQRCode,
}) {
  const intl = useIntl();

  return (
    <DeviceAuthenticationWrapper>
      <StepHeadline>
        ({currentStep}/{numberOfSteps}){' '}
        {intl.formatMessage({ id: 'modal.createDevice.authenticationQRCode' })}
      </StepHeadline>
      <StepDescription>
        {intl.formatMessage({
          id: 'modal.createDevice.authenticationQRCode.description',
        })}
      </StepDescription>
      <DeviceAuthenticationContent>
        <QRCodeWrapper>
          <QRCode value={authenticationQRCode} size={200} level="M" />
        </QRCodeWrapper>
      </DeviceAuthenticationContent>
    </DeviceAuthenticationWrapper>
  );
}
