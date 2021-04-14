import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { Success } from '../../../generalOnboarding/Success';
import {
  nextButtonStyles,
  backButtonStyles,
  noButtonStyles,
  Wrapper,
  Header,
  Description,
  ButtonWrapper,
} from '../../../generalOnboarding/Onboarding.styled';

export const Complete = ({ back, next, location, createLocation, done }) => {
  const intl = useIntl();

  return (
    <Wrapper>
      <Header>
        {intl.formatMessage({
          id: 'modal.createLocation.complete.title',
        })}
      </Header>
      <Description>
        {intl.formatMessage({
          id: 'modal.createLocation.complete.description',
        })}
      </Description>
      {!location ? (
        <ButtonWrapper multipleButtons>
          <Button style={backButtonStyles} onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button
            data-cy="done"
            style={nextButtonStyles}
            onClick={createLocation}
          >
            {intl.formatMessage({
              id: 'createGroup.button.done',
            })}
          </Button>
        </ButtonWrapper>
      ) : (
        <>
          <ButtonWrapper>
            <Success />
          </ButtonWrapper>
          <Header style={{ marginTop: 40 }}>
            {intl.formatMessage({
              id: 'modal.createLocation.complete.showCodes',
            })}
          </Header>
          <ButtonWrapper multipleButtons style={{ justifyContent: 'flex-end' }}>
            <Button
              style={{ ...noButtonStyles, marginRight: 24 }}
              onClick={done}
              data-cy="no"
            >
              {intl.formatMessage({
                id: 'no',
              })}
            </Button>
            <Button data-cy="yes" style={nextButtonStyles} onClick={next}>
              {intl.formatMessage({
                id: 'yes',
              })}
            </Button>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
};
