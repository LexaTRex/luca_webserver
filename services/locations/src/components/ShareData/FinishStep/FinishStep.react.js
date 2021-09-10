import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';

// Components
import { ContentWrapper, SubTitle, SuccessWrapper } from './FinishStep.styled';

export const FinishStep = () => {
  const intl = useIntl();

  return (
    <ContentWrapper>
      <SuccessWrapper>
        <Tick size={100} />
      </SuccessWrapper>
      <SubTitle>{intl.formatMessage({ id: 'shareData.finish.text' })}</SubTitle>
      <SubTitle>
        {intl.formatMessage({ id: 'shareData.finish.closeTab' })}
      </SubTitle>
    </ContentWrapper>
  );
};
