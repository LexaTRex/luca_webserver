import React from 'react';
import { useIntl } from 'react-intl';
import {
  PrimaryButton,
  SecondaryButton,
} from 'components/general/Buttons.styled';

import { Success } from '../../../generalOnboarding/Success';
import {
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const Complete = ({ back, next, group, createGroup, done }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createGroup.complete.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createGroup.complete.description',
        })}
      </Description>
      {!group ? (
        <ButtonWrapper multipleButtons>
          <SecondaryButton onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </SecondaryButton>
          <PrimaryButton data-cy="finishGroupCreation" onClick={createGroup}>
            {intl.formatMessage({
              id: 'createGroup.button.done',
            })}
          </PrimaryButton>
        </ButtonWrapper>
      ) : (
        <>
          <ButtonWrapper>
            <Success />
          </ButtonWrapper>
          <Header style={{ marginTop: 40 }}>
            {intl.formatMessage({
              id: 'modal.createGroup.complete.showCodes',
            })}
          </Header>
          <ButtonWrapper multipleButtons style={{ justifyContent: 'flex-end' }}>
            <PrimaryButton
              data-cy="no"
              isButtonWhite
              style={{ marginRight: 24 }}
              onClick={done}
            >
              {intl.formatMessage({
                id: 'no',
              })}
            </PrimaryButton>
            <PrimaryButton data-cy="yes" onClick={next}>
              {intl.formatMessage({
                id: 'yes',
              })}
            </PrimaryButton>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
};
