import React, { useEffect, useCallback, useState } from 'react';

import { useIntl } from 'react-intl';
import { Steps, notification } from 'antd';
import { useQueryClient } from 'react-query';

import { reactivateDevice } from 'network/api';

import { generatePIN, generateTransferQRCodeData } from 'utils/operatorDevice';

import { useModal } from 'components/hooks/useModal';

import {
  DEVICE_AUTHENTICATION_QR_CODE_STEP,
  DEVICE_AUTHENTICATION_ENCRYPTION_PIN_STEP,
} from './ReactivateDeviceModal.helper';

import { DeviceAuthenticationPIN } from '../deviceSetupSteps/DeviceAuthenticationPIN';
import { DeviceAuthenticationQRCode } from '../deviceSetupSteps/DeviceAuthenticationQRCode';

import { Wrapper } from './ReactivateDeviceModal.styled';

export function ReactivateDeviceModal({ deviceId }) {
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const [_, closeModal] = useModal();
  const queryClient = useQueryClient();
  const [authenticationPIN] = useState(generatePIN());
  const [currentStep, setCurrentStep] = useState(0);
  const [authenticationQRCode, setAuthenticationQRCode] = useState(null);

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onDone = () => {
    closeModal();
    queryClient.invalidateQueries('devices');
  };

  const onReactivate = useCallback(async () => {
    try {
      const device = await reactivateDevice(deviceId);

      const authenticationQRCodeData = await generateTransferQRCodeData(
        'AUTHENTICATION_TOKEN',
        device.refreshToken,
        authenticationPIN
      );

      setAuthenticationQRCode(authenticationQRCodeData);
      notification.success({
        message: intl.formatMessage({ id: 'notification.device.success' }),
      });
    } catch {
      notification.error({
        message: intl.formatMessage({ id: 'notification.device.error' }),
      });
      closeModal();
    }
  }, [authenticationPIN, closeModal, deviceId, intl]);

  const steps = [
    {
      id: DEVICE_AUTHENTICATION_QR_CODE_STEP,
      content: (
        <DeviceAuthenticationQRCode
          next={nextStep}
          currentStep={1}
          numberOfSteps={2}
          authenticationQRCode={authenticationQRCode}
        />
      ),
    },
    {
      id: DEVICE_AUTHENTICATION_ENCRYPTION_PIN_STEP,
      content: (
        <DeviceAuthenticationPIN
          next={nextStep}
          onDone={onDone}
          currentStep={2}
          numberOfSteps={2}
          back={previousStep}
          authenticationPIN={authenticationPIN}
        />
      ),
    },
  ];

  useEffect(() => {
    onReactivate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  if (!authenticationQRCode) {
    return null;
  }

  return (
    <Wrapper>
      <Steps
        current={currentStep}
        style={{ margin: 0 }}
        progressDot={() => null}
      >
        {steps.map(step => (
          <Steps.Step key={step.id} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </Wrapper>
  );
}
