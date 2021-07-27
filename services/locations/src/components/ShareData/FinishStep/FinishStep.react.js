import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';
import { PrimaryButton } from 'components/general';

// Components
import { FinishButtonWrapper } from '../ShareData.styled';
import { ContentWrapper, SubTitle, SuccessWrapper } from './FinishStep.styled';

export const FinishStep = ({ done }) => {
  const intl = useIntl();

  return (
    <ContentWrapper>
      <SuccessWrapper>
        <Tick size={100} />
      </SuccessWrapper>
      <SubTitle>{intl.formatMessage({ id: 'shareData.finish.text' })}</SubTitle>
      <FinishButtonWrapper align="flex-end">
        <PrimaryButton onClick={done} data-cy="finish">
          {intl.formatMessage({ id: 'shareData.finish' })}
        </PrimaryButton>
      </FinishButtonWrapper>
    </ContentWrapper>
  );
};
