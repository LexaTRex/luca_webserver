import React from 'react';
import { useIntl } from 'react-intl';

import { PrimaryButton } from 'components/general';

import {
  StepFooter,
  StepHeadline,
  StepFooterRight,
  StepDescription,
} from '../CreateDeviceModal.styled';

import {
  PINValue,
  DeviceAuthenticationPINContent,
  DeviceAuthenticationPINWrapper,
} from './DeviceAuthenticationPIN.styled';

export function DeviceAuthenticationPIN({
  onDone,
  currentStep,
  numberOfSteps,
  authenticationPIN,
}) {
  const intl = useIntl();

  return (
    <DeviceAuthenticationPINWrapper>
      <StepHeadline>
        ({currentStep}/{numberOfSteps}){' '}
        {intl.formatMessage({ id: 'modal.createDevice.authenticationQRCode' })}
      </StepHeadline>
      <StepDescription>
        {intl.formatMessage({
          id: 'modal.createDevice.authenticationQRCode.description',
        })}
      </StepDescription>
      <DeviceAuthenticationPINContent>
        <PINValue>{authenticationPIN}</PINValue>
      </DeviceAuthenticationPINContent>
      <StepFooter>
        <StepFooterRight>
          {numberOfSteps === currentStep && (
            <PrimaryButton onClick={onDone}>
              {intl.formatMessage({
                id: 'modal.createDevice.done',
              })}
            </PrimaryButton>
          )}
        </StepFooterRight>
      </StepFooter>
    </DeviceAuthenticationPINWrapper>
  );
}
