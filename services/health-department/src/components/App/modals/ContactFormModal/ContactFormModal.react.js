import React, { useState, useEffect } from 'react';
import { Steps } from 'antd';

import { useModal } from 'components/hooks/useModal';

import { getHealthDepartment } from 'network/api';

import { REQUEST_STEP, FINISH_STEP } from './ContactFormModal.helper';

import { RequestStep } from './steps/RequestStep';
import { FinishStep } from './steps/FinishStep';

export const ContactFormModal = ({ profileData }) => {
  const [, closeModal] = useModal();
  const [currentStep, setCurrentStep] = useState(0);
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    if (!profileData) return;
    getHealthDepartment(profileData.departmentId)
      .then(newDepartment => {
        setDepartment(newDepartment);
      })
      .catch(error => console.error(error));
  }, [profileData]);

  if (!department) return null;

  const nextStep = () => setCurrentStep(currentStep + 1);

  const steps = [
    {
      id: REQUEST_STEP,
      content: (
        <RequestStep
          next={nextStep}
          closeModal={closeModal}
          department={department}
          profileData={profileData}
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
