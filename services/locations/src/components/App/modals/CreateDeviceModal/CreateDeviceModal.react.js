import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import { Steps, notification } from 'antd';
import { useQuery, useQueryClient } from 'react-query';

import {
  createDevice,
  createChallenge,
  getPrivateKeySecret,
  getChallengeState,
} from 'network/api';
import { generatePrivateKeyFile } from 'utils/privateKey';
import { generatePIN, generateTransferQRCodeData } from 'utils/operatorDevice';

import { useModal } from 'components/hooks/useModal';

import {
  SELECT_DEVICE_ROLE_STEP,
  DEVICE_PRIVATE_KEY_QR_CODE_STEP,
  DEVICE_AUTHENTICATION_QR_CODE_STEP,
  DEVICE_PRIVATE_KEY_ENCRYPTION_PIN_STEP,
  DEVICE_AUTHENTICATION_ENCRYPTION_PIN_STEP,
} from './CreateDeviceModal.helper';

import { PrivateKeyPIN } from '../deviceSetupSteps/PrivateKeyPIN';
import { PrivateKeyQRCode } from '../deviceSetupSteps/PrivateKeyQRCode';
import { SelectDeviceRole } from '../deviceSetupSteps/SelectDeviceRole';
import { DeviceAuthenticationPIN } from '../deviceSetupSteps/DeviceAuthenticationPIN';
import { DeviceAuthenticationQRCode } from '../deviceSetupSteps/DeviceAuthenticationQRCode';

import { Wrapper } from './CreateDeviceModal.styled';

export function CreateDeviceModal({ privateKey }) {
  const intl = useIntl();
  // eslint-disable-next-line no-unused-vars
  const [_, closeModal] = useModal();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [deviceRole, setDeviceRole] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [privateKeyPIN, setPrivateKeyPIN] = useState('');
  const [authenticationPIN, setAuthenticationPIN] = useState('');
  const [privateKeyQRCode, setPrivateKeyQRCode] = useState(null);
  const [authenticationQRCode, setAuthenticationQRCode] = useState(null);

  const { data: privateKeySecret, isLoading } = useQuery(
    'privateKeySecret',
    getPrivateKeySecret,
    {
      retry: false,
    }
  );
  const { data: challenge } = useQuery(
    ['challenge', challengeId],
    () => getChallengeState(challengeId),
    {
      refetchInterval: 750,
      enabled: !!challengeId,
    }
  );

  const isPrivateKeyNeeded = deviceRole !== 'scanner';
  const numberOfSteps = isPrivateKeyNeeded ? 4 : 2;

  const onCancel = () => {
    closeModal();
  };

  const onDone = () => {
    closeModal();
    queryClient.invalidateQueries('devices');
  };

  useEffect(() => {
    // eslint-disable-next-line default-case
    switch (challenge?.state) {
      case 'AUTHENTICATION_PIN_REQUIRED': {
        setCurrentStep(2);
        break;
      }
      case 'PRIVATE_KEY_REQUIRED': {
        if (isPrivateKeyNeeded) {
          setCurrentStep(3);
          break;
        }

        onCancel();
        break;
      }
      case 'PRIVATE_KEY_PIN_REQUIRED': {
        if (isPrivateKeyNeeded) {
          setCurrentStep(4);
          break;
        }

        onCancel();
        break;
      }
      case 'CANCELED': {
        onCancel();
        break;
      }
      case 'DONE': {
        onDone();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge?.state]);

  const onCreate = async role => {
    try {
      const privateKeyEncryptionPIN = generatePIN();
      const authenticationEncryptionPIN = generatePIN();
      const device = await createDevice(role);
      const createdChallenge = await createChallenge();

      setPrivateKeyPIN(privateKeyEncryptionPIN);
      setAuthenticationPIN(authenticationEncryptionPIN);

      const authenticationQRCodeData = await generateTransferQRCodeData(
        'AUTHENTICATION_TOKEN',
        device.refreshToken,
        authenticationEncryptionPIN,
        createdChallenge.uuid
      );

      const privateKeyQRCodeData = await generateTransferQRCodeData(
        'PRIVATE_KEY',
        generatePrivateKeyFile(privateKey, privateKeySecret),
        privateKeyEncryptionPIN,
        createdChallenge.uuid
      );

      setDeviceRole(role);
      setChallengeId(createdChallenge.uuid);
      setPrivateKeyQRCode(privateKeyQRCodeData);
      setAuthenticationQRCode(authenticationQRCodeData);
      notification.success({
        message: intl.formatMessage({ id: 'notification.device.success' }),
      });
      setCurrentStep(1);
    } catch {
      notification.error({
        message: intl.formatMessage({ id: 'notification.device.error' }),
      });
    }
  };

  const steps = [
    {
      id: SELECT_DEVICE_ROLE_STEP,
      content: <SelectDeviceRole onCreate={onCreate} onCancel={onCancel} />,
    },
    {
      id: DEVICE_AUTHENTICATION_QR_CODE_STEP,
      content: (
        <DeviceAuthenticationQRCode
          currentStep={1}
          deviceRole={deviceRole}
          numberOfSteps={numberOfSteps}
          authenticationQRCode={authenticationQRCode}
        />
      ),
    },
    {
      id: DEVICE_AUTHENTICATION_ENCRYPTION_PIN_STEP,
      content: (
        <DeviceAuthenticationPIN
          onDone={onDone}
          currentStep={2}
          deviceRole={deviceRole}
          numberOfSteps={numberOfSteps}
          authenticationPIN={authenticationPIN}
        />
      ),
    },
    ...(isPrivateKeyNeeded
      ? [
          {
            id: DEVICE_PRIVATE_KEY_QR_CODE_STEP,
            content: (
              <PrivateKeyQRCode
                currentStep={3}
                deviceRole={deviceRole}
                numberOfSteps={numberOfSteps}
                privateKeyQRCode={privateKeyQRCode}
              />
            ),
          },
          {
            id: DEVICE_PRIVATE_KEY_ENCRYPTION_PIN_STEP,
            content: (
              <PrivateKeyPIN
                onDone={onDone}
                currentStep={numberOfSteps}
                numberOfSteps={numberOfSteps}
                privateKeyPIN={privateKeyPIN}
              />
            ),
          },
        ]
      : []),
  ];

  if (isLoading) {
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
