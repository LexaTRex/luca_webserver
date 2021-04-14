import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import {
  nextButtonStyles,
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
        <Button style={nextButtonStyles} onClick={next}>
          {intl.formatMessage({
            id: 'authentication.button.ok',
          })}
        </Button>
      </ButtonWrapper>
    </>
  );
};
