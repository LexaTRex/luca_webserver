import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import {
  nextButtonStyles,
  backButtonStyles,
  noButtonStyles,
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
        <Button style={backButtonStyles} onClick={back}>
          {intl.formatMessage({
            id: 'authentication.form.button.back',
          })}
        </Button>
        <div>
          <Button style={{ ...noButtonStyles, marginRight: 24 }} onClick={next}>
            {intl.formatMessage({
              id: 'no',
            })}
          </Button>
          <Button data-cy="yes" style={nextButtonStyles} onClick={onNext}>
            {intl.formatMessage({
              id: 'yes',
            })}
          </Button>
        </div>
      </ButtonWrapper>
    </Wrapper>
  );
};
