import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton, SecondaryButton } from 'components/general';
import {
  ButtonWrapper,
  Description,
  Header,
  Wrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';

export const GooglePlacesInput = ({ setEnabled, back, next }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.googlePlacesInput.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createGroup.googlePlacesInput.description',
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
            data-cy="no"
            style={{ marginRight: 24 }}
            onClick={() => {
              setEnabled(false);
              next();
            }}
            isButtonWhite
          >
            {intl.formatMessage({
              id: 'no',
            })}
          </PrimaryButton>
          <PrimaryButton
            data-cy="yes"
            onClick={() => {
              setEnabled(true);
              next();
            }}
          >
            {intl.formatMessage({
              id: 'yes',
            })}
          </PrimaryButton>
        </div>
      </ButtonWrapper>
    </Wrapper>
  );
};
