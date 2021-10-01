import React, { useState } from 'react';
import { Steps } from 'antd';

// hooks
import { useModal } from 'components/hooks/useModal';

import { REQUEST_STEP, FINISH_STEP } from './ContactFormModal.helper';

import { RequestStep } from './steps/RequestStep';
import { FinishStep } from './steps/FinishStep';

export const ContactFormModal = ({ operator }) => {
  const [, closeModal] = useModal();
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(currentStep + 1);

  const steps = [
    {
      id: REQUEST_STEP,
      content: (
        <RequestStep
          operator={operator}
          next={nextStep}
          closeModal={closeModal}
        />
      ),
    },
    {
      id: FINISH_STEP,
      content: <FinishStep done={closeModal} />,
    },
  ];

  return (
    <>
      <Steps
        progressDot={() => null}
        current={currentStep}
        style={{ display: 'none' }}
      >
        {steps.map(step => (
          <Steps.Step key={step.id} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </>
  );
};
