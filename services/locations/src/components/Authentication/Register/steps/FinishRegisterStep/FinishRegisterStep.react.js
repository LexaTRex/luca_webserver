import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton } from 'components/general/Buttons.styled';

import {
  CardTitle,
  CardSubTitle,
  ButtonWrapper,
  Step,
} from 'components/Authentication/Authentication.styled';

export const FinishRegisterStep = ({ next, navigation }) => {
  const intl = useIntl();

  return (
    <>
      <Step>{navigation}</Step>
      <CardTitle data-cy="finishRegister">
        {intl.formatMessage({
          id: 'authentication.finishRegister.title',
        })}
      </CardTitle>
      <CardSubTitle>
        {intl.formatMessage({
          id: 'authentication.finishRegister.subTitle',
        })}
      </CardSubTitle>

      <ButtonWrapper>
        <PrimaryButton
          $isButtonWhite
          onClick={next}
          data-cy="endRegistrationButton"
        >
          {intl.formatMessage({
            id: 'authentication.button.ok',
          })}
        </PrimaryButton>
      </ButtonWrapper>
    </>
  );
};
