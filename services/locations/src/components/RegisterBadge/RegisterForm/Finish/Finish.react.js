import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';
import { PrimaryButton } from 'components/general';

// Components
import {
  SubTitle,
  ButtonRow,
  ContentWrapper,
  SuccessWrapper,
} from '../RegisterForm.styled';

export const Finish = ({ onFinish }) => {
  const intl = useIntl();

  return (
    <ContentWrapper>
      <SuccessWrapper>
        <Tick size={100} />
      </SuccessWrapper>
      <SubTitle>{intl.formatMessage({ id: 'registerBadge.finish' })}</SubTitle>

      <ButtonRow>
        <PrimaryButton onClick={onFinish}>
          {intl.formatMessage({ id: 'registerBadge.end' })}
        </PrimaryButton>
      </ButtonRow>
    </ContentWrapper>
  );
};
