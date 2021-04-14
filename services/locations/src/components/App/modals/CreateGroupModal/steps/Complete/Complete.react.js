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
          <Button style={backButtonStyles} onClick={back}>
            {intl.formatMessage({
              id: 'authentication.form.button.back',
            })}
          </Button>
          <Button
            data-cy="finishGroupCreation"
            style={nextButtonStyles}
            onClick={createGroup}
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
              id: 'modal.createGroup.complete.showCodes',
            })}
          </Header>
          <ButtonWrapper multipleButtons style={{ justifyContent: 'flex-end' }}>
            <Button
              data-cy="no"
              style={{ ...noButtonStyles, marginRight: 24 }}
              onClick={done}
            >
              {intl.formatMessage({
                id: 'no',
              })}
            </Button>
            <Button style={nextButtonStyles} onClick={next}>
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
