import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { REGISTER_ROUTE } from 'constants/routes';

import {
  ButtonsWrapper,
  ButtonWrapper,
  Divider,
  StyledPrimaryButton,
  StyledSecondaryButton,
} from './LoginActions.styled';

export const LoginActions = () => {
  const intl = useIntl();
  const history = useHistory();
  const onRedirect = () => history.push(REGISTER_ROUTE);

  return (
    <ButtonsWrapper>
      <ButtonWrapper>
        <StyledPrimaryButton htmlType="submit">
          {intl.formatMessage({
            id: 'authentication.login.title',
          })}
        </StyledPrimaryButton>
      </ButtonWrapper>
      <Divider />
      <ButtonWrapper>
        <StyledSecondaryButton onClick={onRedirect}>
          {intl.formatMessage({
            id: 'authentication.register.title',
          })}
        </StyledSecondaryButton>
      </ButtonWrapper>
    </ButtonsWrapper>
  );
};
