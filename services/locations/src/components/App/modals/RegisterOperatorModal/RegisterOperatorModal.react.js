import React, { useState } from 'react';
import { Steps } from 'antd';

import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { storePublicKey } from 'network/api';
import { useModal } from 'components/hooks/useModal';
import { DownloadPrivateKey } from './steps/DownloadPrivateKey';
import { VerifyPrivateKey } from './steps/VerifyPrivateKey';

import { Wrapper, Title } from './RegisterOperatorModal.styled';

/**
 * Modal for registering a new location. Generates a new keypair and
 * uploads the public key to the backend.
 *
 * @see https://www.luca-app.de/securityoverview/processes/venue_registration.html#process
 */
export const RegisterOperatorModal = ({ operator, privateKeySecret }) => {
  const intl = useIntl();
  const [publicKey, setPublicKey] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [, closeModal] = useModal();

  const queryClient = useQueryClient();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const onFinish = () => {
    storePublicKey({ publicKey })
      .then(() => {
        queryClient.invalidateQueries('me');
        closeModal();
      })
      .catch(error => console.error(error));
  };

  const steps = [
    {
      id: '0',
      title: 'modal.registerOperator.title',
      content: (
        <DownloadPrivateKey
          privateKeySecret={privateKeySecret}
          operator={operator}
          next={nextStep}
          setPublicKey={setPublicKey}
        />
      ),
    },
    {
      id: '1',
      title: 'modal.registerOperator.keyTest',
      content: (
        <VerifyPrivateKey
          privateKeySecret={privateKeySecret}
          publicKey={publicKey}
          back={previousStep}
          confirmKey={onFinish}
        />
      ),
    },
  ];

  return (
    <Wrapper>
      <Title>{intl.formatMessage({ id: steps[currentStep].title })}</Title>
      <Steps progressDot={() => null} current={currentStep}>
        {steps.map(step => (
          <Steps.Step key={step.id} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </Wrapper>
  );
};
