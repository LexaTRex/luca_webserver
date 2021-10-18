import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Steps } from 'antd';
import { GooglePlacesInput } from 'components/App/modals/generalOnboarding/GooglePlacesInput';
import { useModal } from 'components/hooks/useModal';
import { Header } from './EditAddressModal.styled';
import { EditAddressStep } from './EditAddressStep';

export const EditAddressModal = ({ isGroup, locationId, refetch }) => {
  const intl = useIntl();
  const [googleEnabled, setGoogleEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [, closeModal] = useModal();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    {
      id: 'GOOGLE_PLACES_OPT_IN_STEP',
      title: 'modal.createGroup.googlePlacesInput.title',
      content: (
        <GooglePlacesInput
          setEnabled={setGoogleEnabled}
          next={nextStep}
          back={closeModal}
        />
      ),
    },
    {
      id: 'ADDRESS_INPUT_STEP',
      title: 'settings.location.editAddressLink',
      content: (
        <EditAddressStep
          isGroup={isGroup}
          refetch={refetch}
          locationId={locationId}
          googleEnabled={googleEnabled}
          back={previousStep}
          close={closeModal}
        />
      ),
    },
  ];
  return (
    <>
      <Header>{intl.formatMessage({ id: steps[currentStep].title })}</Header>
      <Steps
        data-cy="EditAddressModalSteps"
        progressDot={() => null}
        current={currentStep}
        style={{ margin: 0 }}
      >
        {steps.map(step => (
          <Steps.Step key={step.id} />
        ))}
      </Steps>
      {steps[currentStep].content}
    </>
  );
};
