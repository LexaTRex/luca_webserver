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
} from './PrivateKeyPIN.styled';

export function PrivateKeyPIN({ onDone, privateKeyPIN }) {
  const intl = useIntl();

  return (
    <DeviceAuthenticationPINWrapper>
      <StepHeadline>
        (4/4) {intl.formatMessage({ id: 'modal.createDevice.privateKeyPIN' })}
      </StepHeadline>
      <StepDescription>
        {intl.formatMessage({
          id: 'modal.createDevice.privateKeyPIN.description',
        })}
      </StepDescription>
      <DeviceAuthenticationPINContent>
        <PINValue>{privateKeyPIN}</PINValue>
      </DeviceAuthenticationPINContent>
      <StepFooter>
        <StepFooterRight>
          <PrimaryButton onClick={onDone}>
            {intl.formatMessage({
              id: 'modal.createDevice.done',
            })}
          </PrimaryButton>
        </StepFooterRight>
      </StepFooter>
    </DeviceAuthenticationPINWrapper>
  );
}
