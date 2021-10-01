import React from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import {
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const PatientInput = ({ setPatientRequired, next, back }) => {
  const intl = useIntl();

  const onNext = () => {
    setPatientRequired(true);
    next();
  };

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.patientInput.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createGroup.patientInput.description',
        })}
      </Description>
      <ButtonWrapper multipleButtons>
        <SecondaryButton onClick={back}>
          {intl.formatMessage({
            id: 'authentication.form.button.back',
          })}
        </SecondaryButton>
        <div>
          <PrimaryButton
            style={{ marginRight: 24 }}
            $isButtonWhite
            onClick={next}
          >
            {intl.formatMessage({
              id: 'no',
            })}
          </PrimaryButton>
          <PrimaryButton data-cy="yes" onClick={onNext}>
            {intl.formatMessage({
              id: 'yes',
            })}
          </PrimaryButton>
        </div>
      </ButtonWrapper>
    </Wrapper>
  );
};
