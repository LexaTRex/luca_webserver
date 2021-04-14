import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'antd';

import { IS_MOBILE } from 'constants/environment';

// Components
import { FinishButtonWrapper } from '../GroupShareData.styled';
import { SubTitle, ContentWrapper, SuccessWrapper } from './FinishStep.styled';

export const FinishStep = ({ done }) => {
  const intl = useIntl();

  return (
    <ContentWrapper>
      <SuccessWrapper>
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"> </span>
            <span className="icon-line line-long"> </span>
            <div className="icon-circle"> </div>
            <div className="icon-fix"> </div>
          </div>
        </div>
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
