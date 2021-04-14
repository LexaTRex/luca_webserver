import React from 'react';
import { useIntl } from 'react-intl';
import { Tick } from 'react-crude-animated-tick';
import { Button } from 'antd';

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
        <Button
          onClick={onFinish}
          style={{
            padding: '0 40px',
            color: 'black',
            backgroundColor: '#b8c0ca',
          }}
        >
          {intl.formatMessage({ id: 'registerBadge.end' })}
        </Button>
      </ButtonRow>
    </ContentWrapper>
  );
};
