import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';
import { Button } from 'antd';

import { IS_MOBILE } from 'constants/environment';

// Components
import { FinishButtonWrapper } from '../ShareData.styled';
import { SubTitle, ContentWrapper, SuccessWrapper } from './FinishStep.styled';

export const FinishStep = ({ done }) => {
  const intl = useIntl();

  return (
    <ContentWrapper>
      <SuccessWrapper>
        <Tick size={100} />
      </SuccessWrapper>
      <SubTitle>{intl.formatMessage({ id: 'shareData.finish.text' })}</SubTitle>
      <FinishButtonWrapper>
        <Button
          onClick={done}
          style={{ height: 40, width: IS_MOBILE ? '100%' : 200 }}
        >
          {intl.formatMessage({ id: 'shareData.finish' })}
        </Button>
      </FinishButtonWrapper>
    </ContentWrapper>
  );
};
