import React from 'react';
import { useIntl } from 'react-intl';
import { PrimaryButton, SecondaryButton } from 'components/general';
import {
  ButtonWrapper,
  Description,
  Wrapper,
} from 'components/App/modals/generalOnboarding/Onboarding.styled';
import { GooglePlacesPrimaryButton } from './GooglePlacesInput.styled';

export const GooglePlacesInput = ({ setEnabled, back, next }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <Description>
        {intl.formatMessage({
          id: 'modal.createGroup.googlePlacesInput.description',
        })}
      </Description>
      <ButtonWrapper multipleButtons>
        <SecondaryButton onClick={back}>
          {intl.formatMessage({
            id: 'account.delete.cancel',
          })}
        </SecondaryButton>
        <div>
          <GooglePlacesPrimaryButton
            data-cy="no"
            onClick={() => {
              setEnabled(false);
              next();
            }}
            isButtonWhite
          >
            {intl.formatMessage({
              id: 'no',
            })}
          </GooglePlacesPrimaryButton>
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
