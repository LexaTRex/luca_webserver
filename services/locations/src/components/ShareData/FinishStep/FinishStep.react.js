import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';

// Components
import { CustomButton, FinishButtonWrapper } from '../ShareData.styled';
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
        <CustomButton
          width="200px"
          onClick={done}
          data-cy="finish"
          bgColor="#c3ced9"
        >
          {intl.formatMessage({ id: 'shareData.finish' })}
        </CustomButton>
      </FinishButtonWrapper>
    </ContentWrapper>
  );
};
